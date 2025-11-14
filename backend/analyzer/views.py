import os
import re
import json
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Resume, Analysis
from .ml_analysis import ResumeAnalyzer, TextExtractor
from .job_fetcher import fetch_jobs_from_adzuna
from django.conf import settings

# Common skills database (in a real app, this would be more extensive)
COMMON_SKILLS = [
    'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js', 'express',
    'sql', 'mongodb', 'postgresql', 'mysql', 'django', 'flask', 'spring', 'docker',
    'kubernetes', 'aws', 'azure', 'gcp', 'git', 'html', 'css', 'sass', 'bootstrap',
    'typescript', 'php', 'c++', 'c#', 'ruby', 'rails', 'go', 'rust', 'swift',
    'kotlin', 'scala', 'r', 'matlab', 'tensorflow', 'pytorch', 'keras', 'pandas',
    'numpy', 'scikit-learn', 'matplotlib', 'seaborn', 'tableau', 'power bi',
    'excel', 'spark', 'hadoop', 'kafka', 'redis', 'elasticsearch', 'nginx',
    'apache', 'linux', 'ubuntu', 'centos', 'bash', 'powershell', 'jenkins',
    'gitlab', 'github', 'bitbucket', 'jira', 'confluence', 'salesforce', 'sap',
    'oracle', 'qlik', 'looker', 'snowflake', 'redshift', 'bigquery', 'databricks',
    'airflow', 'mlflow', 'fastapi', 'graphql', 'rest', 'api', 'microservices',
    'devops', 'ci/cd', 'agile', 'scrum', 'kanban', 'waterfall', 'project management',
    'product management', 'data analysis', 'data science', 'machine learning',
    'deep learning', 'natural language processing', 'computer vision', 'blockchain',
    'cybersecurity', 'penetration testing', 'encryption', 'firewall', 'networking',
    'system administration', 'database administration', 'cloud architecture',
    'solution architecture', 'technical leadership', 'team management',
    'software development', 'web development', 'mobile development', 'frontend',
    'backend', 'fullstack', 'ui/ux', 'design', 'testing', 'qa', 'automation',
    'manual testing', 'unit testing', 'integration testing', 'performance testing'
]

def extract_skills(text):
    """Extract skills from text using keyword matching"""
    skills_found = []
    
    # Convert to lowercase for matching
    text_lower = text.lower()
    
    # Simple keyword matching approach
    for skill in COMMON_SKILLS:
        if skill.lower() in text_lower:
            skills_found.append(skill)
    
    return list(set(skills_found))  # Remove duplicates

def calculate_similarity(resume_text, jd_text):
    """Calculate similarity between resume and job description using TF-IDF"""
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        
        # Handle empty texts
        if not resume_text or not jd_text:
            return 0.0
            
        # Handle very short texts
        if len(resume_text.strip()) < 10 or len(jd_text.strip()) < 10:
            return 0.0
        
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        
        # Calculate cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        
        # Extract the similarity value and ensure it's valid
        score = similarity[0][0] * 100  # Convert to percentage
        
        # Handle NaN values
        if score != score:  # Check for NaN
            score = 0.0
            
        # Ensure score is within valid range
        score = max(0.0, min(100.0, score))
        
        return score
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0.0

def get_missing_skills(resume_skills, jd_skills):
    """Find skills in job description that are missing from resume"""
    return list(set(jd_skills) - set(resume_skills))

def fetch_jobs_from_adzuna(skills):
    """Fetch jobs from Adzuna API based on skills"""
    try:
        import requests
        
        app_id = settings.ADZUNA_APP_ID
        app_key = settings.ADZUNA_APP_KEY
        country = 'in'  # India
        
        print(f"Fetching jobs with APP_ID: {app_id[:4]}... and skills: {skills}")
        
        # Try to fetch jobs based on specific skills first
        jobs = []
        
        # If we have skills, try to fetch jobs for those skills
        if skills:
            # Try each skill individually first to get more targeted results
            for skill in skills[:5]:  # Limit to first 5 skills
                url = f'https://api.adzuna.com/v1/api/jobs/{country}/search/1'
                params = {
                    'app_id': app_id,
                    'app_key': app_key,
                    'results_per_page': 3,  # Fewer results per skill
                    'what': skill,
                    'content-type': 'application/json'
                }
                
                print(f"Searching for jobs with skill: {skill}")
                
                try:
                    response = requests.get(url, params=params, timeout=10)
                    print(f"Response status for {skill}: {response.status_code}")
                    
                    if response.status_code == 200:
                        data = response.json()
                        print(f"Found {len(data.get('results', []))} jobs for {skill}")
                        
                        for result in data.get('results', []):
                            job = {
                                'title': result.get('title', ''),
                                'company': result.get('company', {}).get('display_name', 'Unknown Company'),
                                'location': result.get('location', {}).get('display_name', 'India'),
                                'salary': '',
                                'apply_link': result.get('redirect_url', ''),
                            }
                            
                            # Format salary if available
                            salary_min = result.get('salary_min')
                            salary_max = result.get('salary_max')
                            if salary_min and salary_max:
                                job['salary'] = f"₹{salary_min:,.0f} - ₹{salary_max:,.0f}"
                            elif salary_min:
                                job['salary'] = f"₹{salary_min:,.0f}+"
                            
                            # Avoid duplicates
                            if job not in jobs and job['title']:
                                jobs.append(job)
                                
                            # Limit total jobs
                            if len(jobs) >= 15:
                                break
                    else:
                        print(f"Error response: {response.text[:200]}")
                
                except requests.Timeout:
                    print(f"Timeout fetching jobs for skill {skill}")
                except Exception as e:
                    print(f"Error fetching jobs for skill {skill}: {e}")
                
                if len(jobs) >= 15:
                    break
            
            # If we still don't have enough jobs, try a combined query
            if len(jobs) < 15 and len(skills) > 1:
                # Join skills for a broader query
                query = ' '.join(skills[:5])  # Limit to first 5 skills
                url = f'https://api.adzuna.com/v1/api/jobs/{country}/search/1'
                params = {
                    'app_id': app_id,
                    'app_key': app_key,
                    'results_per_page': 15 - len(jobs),
                    'what': query,
                    'content-type': 'application/json'
                }
                
                print(f"Trying combined query with: {query}")
                
                try:
                    response = requests.get(url, params=params, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        for result in data.get('results', []):
                            job = {
                                'title': result.get('title', ''),
                                'company': result.get('company', {}).get('display_name', 'Unknown Company'),
                                'location': result.get('location', {}).get('display_name', 'India'),
                                'salary': '',
                                'apply_link': result.get('redirect_url', ''),
                            }
                            
                            # Format salary if available
                            salary_min = result.get('salary_min')
                            salary_max = result.get('salary_max')
                            if salary_min and salary_max:
                                job['salary'] = f"₹{salary_min:,.0f} - ₹{salary_max:,.0f}"
                            elif salary_min:
                                job['salary'] = f"₹{salary_min:,.0f}+"
                            
                            # Avoid duplicates
                            if job not in jobs and job['title']:
                                jobs.append(job)
                                
                            # Limit total jobs
                            if len(jobs) >= 15:
                                break
                except Exception as e:
                    print(f"Error fetching jobs for combined query: {e}")
        
        # If we still don't have jobs, fetch some general tech jobs
        if len(jobs) == 0:
            print("No jobs found with skills, trying general technology search...")
            url = f'https://api.adzuna.com/v1/api/jobs/{country}/search/1'
            params = {
                'app_id': app_id,
                'app_key': app_key,
                'results_per_page': 15,
                'what': 'software developer',
                'content-type': 'application/json'
            }
            
            try:
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    for result in data.get('results', []):
                        job = {
                            'title': result.get('title', ''),
                            'company': result.get('company', {}).get('display_name', 'Unknown Company'),
                            'location': result.get('location', {}).get('display_name', 'India'),
                            'salary': '',
                            'apply_link': result.get('redirect_url', ''),
                        }
                        
                        # Format salary if available
                        salary_min = result.get('salary_min')
                        salary_max = result.get('salary_max')
                        if salary_min and salary_max:
                            job['salary'] = f"₹{salary_min:,.0f} - ₹{salary_max:,.0f}"
                        elif salary_min:
                            job['salary'] = f"₹{salary_min:,.0f}+"
                        
                        if job['title']:
                            jobs.append(job)
            except Exception as e:
                print(f"Error fetching general tech jobs: {e}")
        
        print(f"Total jobs found: {len(jobs)}")
        return jobs
    except Exception as e:
        print(f"Error fetching jobs: {e}")
        import traceback
        traceback.print_exc()
    
    return []

# fetch_youtube_videos function removed - using YouTubeRecommendationEngine from ml_analysis.py instead

@method_decorator(csrf_exempt, name='dispatch')
class UploadView(View):
    def post(self, request):
        try:
            print("Upload request received")
            resume_file = request.FILES.get('resume')
            jd_file = request.FILES.get('jd')
            
            print(f"Resume file: {resume_file}")
            print(f"JD file: {jd_file}")
            
            if not resume_file or not jd_file:
                print("Missing files")
                return JsonResponse({'error': 'Both resume and job description files are required'}, status=400)
            
            # Save files
            print("Saving files...")
            resume = Resume.objects.create(file=resume_file)
            jd = Resume.objects.create(file=jd_file)
            
            print(f"Resume saved with ID: {resume.id}")
            print(f"JD saved with ID: {jd.id}")
            
            # Extract text using the new ML analysis module
            resume_path = resume.file.path
            jd_path = jd.file.path
            
            print(f"Resume path: {resume_path}")
            print(f"JD path: {jd_path}")
            
            resume_text = TextExtractor.extract_text_from_file(resume_path)
            jd_text = TextExtractor.extract_text_from_file(jd_path)
            
            print(f"Resume text length: {len(resume_text)}")
            print(f"JD text length: {len(jd_text)}")
            
            # Save extracted text
            resume.extracted_text = resume_text
            resume.save()
            
            jd.extracted_text = jd_text
            jd.save()
            
            # Extract skills
            print("Extracting skills...")
            resume_skills = extract_skills(resume_text)
            jd_skills = extract_skills(jd_text)
            
            print(f"Resume skills: {resume_skills}")
            print(f"JD skills: {jd_skills}")
            
            # Calculate similarity
            print("Calculating similarity...")
            match_score = calculate_similarity(resume_text, jd_text)
            
            print(f"Match score: {match_score}")
            
            # Find missing skills
            print("Finding missing skills...")
            missing_skills = get_missing_skills(resume_skills, jd_skills)
            
            print(f"Missing skills: {missing_skills}")
            
            # Create analysis record
            print("Creating analysis record...")
            analysis = Analysis.objects.create(
                resume=resume,
                jd=jd,
                match_score=match_score,
                missing_skills=missing_skills,
                extracted_skills=resume_skills
            )
            
            print(f"Analysis created with ID: {analysis.id}")
            
            # Return consistent data structure with overall_score for frontend compatibility
            return JsonResponse({
                'analysis_id': analysis.id,
                'overall_score': match_score,  # Use overall_score for consistency
                'match_score': match_score,    # Keep match_score for backward compatibility
                'semantic_similarity': match_score,  # Use match_score as semantic_similarity for initial upload
                'skill_match_score': match_score,    # Use match_score as skill_match_score for initial upload
                'resume_skills': resume_skills,
                'job_skills': jd_skills,
                'missing_skills': missing_skills,
                'resume_keyword_freq': {},
                'jd_keyword_freq': {}
            })
        except Exception as e:
            print(f"Error in upload view: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class AnalyzeView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            analysis_id = data.get('analysis_id')
            
            print(f"Analyzing with ID: {analysis_id}")
            
            analysis = Analysis.objects.get(id=analysis_id)
            
            print(f"Found analysis: {analysis.id}")
            print(f"Resume text length: {len(analysis.resume.extracted_text) if analysis.resume.extracted_text else 0}")
            print(f"JD text length: {len(analysis.jd.extracted_text) if analysis.jd.extracted_text else 0}")
            
            # Use the new ML analysis for more accurate results
            analyzer = ResumeAnalyzer(settings.YOUTUBE_API_KEY)
            result = analyzer.perform_comprehensive_analysis(
                analysis.resume.extracted_text,
                analysis.jd.extracted_text
            )
            
            print(f"Analysis result keys: {result.keys()}")
            
            # Update analysis record with more detailed results
            analysis.match_score = result['overall_score']
            analysis.missing_skills = result['missing_skills']
            analysis.extracted_skills = result['resume_skills']
            analysis.semantic_similarity = result['semantic_similarity']
            analysis.skill_match_score = result['skill_match_score']
            analysis.suggestions = result['suggestions']
            analysis.resume_keyword_freq = result['resume_keyword_freq']
            analysis.jd_keyword_freq = result['jd_keyword_freq']
            analysis.save()
            
            return JsonResponse({
                'analysis_id': analysis.id,
                'overall_score': result['overall_score'],
                'semantic_similarity': result['semantic_similarity'],
                'skill_match_score': result['skill_match_score'],
                'resume_skills': result['resume_skills'],
                'job_skills': result['job_skills'],
                'missing_skills': result['missing_skills'],
                'resume_keyword_freq': result['resume_keyword_freq'],
                'jd_keyword_freq': result['jd_keyword_freq'],
                'suggestions': result['suggestions'],
                'youtube_recommendations': result['youtube_recommendations']
            })
        except Analysis.DoesNotExist:
            print("Analysis not found")
            return JsonResponse({'error': 'Analysis not found'}, status=404)
        except Exception as e:
            print(f"Error in analyze view: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class JobsView(View):
    def get(self, request):
        try:
            # Get skills from query parameters or use default
            skills_param = request.GET.get('skills', '')
            skills = skills_param.split(',') if skills_param else ['python', 'javascript']
            
            jobs = fetch_jobs_from_adzuna(skills)
            
            return JsonResponse({'jobs': jobs})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class InterviewKitView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            skills = data.get('skills', [])
            
            # Generate questions for each skill
            technical_questions = []
            behavioral_questions = []
            situational_questions = []
            
            # Enhanced skill-specific technical questions
            skill_specific_questions = {
                'python': [
                    {
                        "question": "Explain the difference between list, tuple, and set in Python. When would you use each?",
                        "difficulty": "Medium",
                        "answers": [
                            "Lists are mutable ordered collections with duplicate values. Tuples are immutable ordered collections, useful for fixed data. Sets are unordered collections with unique values, ideal for membership testing and removing duplicates.",
                            "Use lists when you need a modifiable sequence, tuples for data that shouldn't change (like coordinates), and sets when you need to ensure uniqueness or perform fast membership checks."
                        ]
                    },
                    {
                        "question": "What are Python decorators and how do they work? Provide a practical example.",
                        "difficulty": "Hard",
                        "answers": [
                            "Decorators are functions that modify the behavior of other functions. They use the @syntax and wrap functions to add functionality. Example: @login_required adds authentication checks before executing a view function.",
                            "A decorator takes a function as input and returns a modified version. For instance, a @timing decorator can measure execution time by wrapping the original function in timing code."
                        ]
                    },
                    {
                        "question": "How does Python's garbage collection work? What is reference counting?",
                        "difficulty": "Medium",
                        "answers": [
                            "Python uses automatic garbage collection with reference counting and a cyclic garbage collector. When an object's reference count reaches zero, it's deallocated. The cyclic collector handles circular references.",
                            "Reference counting tracks how many references point to an object. Python's gc module handles circular references that reference counting alone can't clean up."
                        ]
                    }
                ],
                'javascript': [
                    {
                        "question": "Explain the difference between var, let, and const in JavaScript.",
                        "difficulty": "Easy",
                        "answers": [
                            "var is function-scoped and can be re-declared. let is block-scoped and can be reassigned but not re-declared. const is block-scoped and cannot be reassigned or re-declared.",
                            "Use const for values that won't change, let for variables that will be reassigned, and avoid var in modern JavaScript due to its confusing scoping rules."
                        ]
                    },
                    {
                        "question": "What is the event loop in JavaScript? How does async/await work?",
                        "difficulty": "Hard",
                        "answers": [
                            "The event loop processes the call stack and callback queue. Async/await is syntactic sugar over Promises, making asynchronous code look synchronous. Await pauses execution until a Promise resolves.",
                            "JavaScript is single-threaded but handles async operations through the event loop. Async functions return Promises, and await suspends execution until the awaited Promise settles."
                        ]
                    },
                    {
                        "question": "Explain closures in JavaScript with a practical use case.",
                        "difficulty": "Medium",
                        "answers": [
                            "A closure is when a function retains access to variables from its outer scope even after the outer function has returned. Useful for data privacy, factory functions, and event handlers.",
                            "Closures enable private variables in JavaScript. For example, a counter function can keep count private while exposing increment/decrement methods through returned functions."
                        ]
                    }
                ],
                'react': [
                    {
                        "question": "Explain the difference between state and props in React. When should you use each?",
                        "difficulty": "Easy",
                        "answers": [
                            "Props are read-only data passed from parent to child components. State is mutable data managed within a component. Use props for component configuration, state for data that changes over time.",
                            "Props flow down the component tree and cannot be modified by the receiving component. State is local to a component and triggers re-renders when updated using setState or useState."
                        ]
                    },
                    {
                        "question": "What are React hooks? Explain useState and useEffect with examples.",
                        "difficulty": "Medium",
                        "answers": [
                            "Hooks let you use state and lifecycle features in functional components. useState manages component state, useEffect handles side effects like API calls and subscriptions. They replace class lifecycle methods.",
                            "useState returns current state and updater function: const [count, setCount] = useState(0). useEffect runs after render: useEffect(() => { fetchData() }, [dependencies])."
                        ]
                    },
                    {
                        "question": "How does React's Virtual DOM work and why is it beneficial?",
                        "difficulty": "Medium",
                        "answers": [
                            "Virtual DOM is an in-memory representation of real DOM. React compares current and previous virtual DOM (reconciliation), calculates minimal changes needed, and efficiently updates only changed real DOM elements.",
                            "Instead of updating the entire real DOM, React creates a virtual copy, diffs changes, and batches updates. This minimizes expensive DOM manipulations and improves performance."
                        ]
                    }
                ],
                'java': [
                    {
                        "question": "Explain the principles of Object-Oriented Programming in Java.",
                        "difficulty": "Easy",
                        "answers": [
                            "OOP has four pillars: Encapsulation (data hiding), Inheritance (code reuse), Polymorphism (multiple forms), and Abstraction (hiding complexity). Java implements these through classes, interfaces, and access modifiers.",
                            "Encapsulation bundles data with methods. Inheritance allows classes to extend others. Polymorphism enables method overriding. Abstraction uses interfaces and abstract classes to define contracts."
                        ]
                    },
                    {
                        "question": "What is the difference between HashMap and ConcurrentHashMap in Java?",
                        "difficulty": "Hard",
                        "answers": [
                            "HashMap is not thread-safe and can cause ConcurrentModificationException. ConcurrentHashMap uses lock striping for thread-safe operations without locking the entire map, providing better concurrency.",
                            "Use HashMap for single-threaded applications. ConcurrentHashMap allows multiple threads to read/write safely by dividing the map into segments, each with its own lock."
                        ]
                    },
                    {
                        "question": "Explain Java's garbage collection and different GC algorithms.",
                        "difficulty": "Hard",
                        "answers": [
                            "Java uses automatic memory management. GC algorithms include Serial GC (single-threaded), Parallel GC (multiple threads), CMS (low-pause), and G1 GC (predictable pause times for large heaps).",
                            "GC works in generations: Young Generation (Eden, Survivor spaces) for new objects, Old Generation for long-lived objects. Different collectors optimize for throughput or low latency."
                        ]
                    }
                ],
                'sql': [
                    {
                        "question": "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN with examples.",
                        "difficulty": "Medium",
                        "answers": [
                            "INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from left table and matching rows from right (NULL if no match). RIGHT JOIN is opposite of LEFT JOIN.",
                            "INNER JOIN: SELECT * FROM A INNER JOIN B ON A.id=B.id gets only matches. LEFT JOIN includes all A records even without B matches. Use based on which table's data must be complete."
                        ]
                    },
                    {
                        "question": "What are database indexes? When should you use them and what are the trade-offs?",
                        "difficulty": "Medium",
                        "answers": [
                            "Indexes are data structures that improve query performance by creating quick lookup tables. Use on frequently queried columns. Trade-offs: faster reads but slower writes, additional storage space.",
                            "Indexes work like book indexes - pointing to data locations. Create on WHERE, JOIN, ORDER BY columns. Over-indexing slows INSERT/UPDATE/DELETE operations and wastes space."
                        ]
                    },
                    {
                        "question": "Explain database normalization. What are the different normal forms?",
                        "difficulty": "Hard",
                        "answers": [
                            "Normalization eliminates redundancy. 1NF: atomic values. 2NF: no partial dependencies. 3NF: no transitive dependencies. BCNF: every determinant is a candidate key. Reduces anomalies, improves integrity.",
                            "1NF removes repeating groups. 2NF ensures non-key attributes depend on entire primary key. 3NF removes dependencies on non-key attributes. Higher forms reduce duplication but may require more joins."
                        ]
                    }
                ],
                'node.js': [
                    {
                        "question": "How does Node.js handle asynchronous operations? Explain the event-driven architecture.",
                        "difficulty": "Medium",
                        "answers": [
                            "Node.js uses a single-threaded event loop with non-blocking I/O. Async operations are delegated to the system kernel or thread pool. When complete, callbacks are queued for execution.",
                            "Event-driven architecture processes events asynchronously. The event loop checks for pending callbacks, executes them, and continues. This enables high concurrency without multiple threads."
                        ]
                    },
                    {
                        "question": "What is middleware in Express.js? Provide examples of common use cases.",
                        "difficulty": "Easy",
                        "answers": [
                            "Middleware functions access request/response objects and next(). Common uses: logging (Morgan), parsing (body-parser), authentication (passport), error handling, CORS.",
                            "Middleware executes in sequence. app.use(express.json()) parses JSON bodies. Custom middleware: app.use((req, res, next) => { console.log(req.method); next(); }). Order matters!"
                        ]
                    }
                ],
                'django': [
                    {
                        "question": "Explain Django's MVT architecture and how it differs from MVC.",
                        "difficulty": "Medium",
                        "answers": [
                            "MVT: Model (data), View (logic), Template (presentation). Unlike MVC, Django's View handles logic while Template handles presentation. Django's framework acts as the Controller.",
                            "Models define database structure. Views process requests and return responses. Templates render HTML. URL dispatcher routes requests to views. Django ORM abstracts database operations."
                        ]
                    },
                    {
                        "question": "What are Django signals and when would you use them?",
                        "difficulty": "Hard",
                        "answers": [
                            "Signals allow decoupled apps to get notified when actions occur. Common signals: pre_save, post_save, pre_delete. Use for actions like sending emails, cache invalidation, logging.",
                            "Signals provide a way to execute code when certain events happen. Example: post_save signal on User model can create a related Profile automatically. Useful for cross-cutting concerns."
                        ]
                    }
                ],
                'docker': [
                    {
                        "question": "Explain the difference between Docker images and containers.",
                        "difficulty": "Easy",
                        "answers": [
                            "Images are read-only templates with application code and dependencies. Containers are running instances of images with their own filesystem, isolated from the host.",
                            "Think of images as classes and containers as objects. Images are built from Dockerfiles. Containers are created from images using 'docker run' and have a writable layer on top."
                        ]
                    },
                    {
                        "question": "What is Docker Compose and when would you use it?",
                        "difficulty": "Medium",
                        "answers": [
                            "Docker Compose orchestrates multi-container applications using YAML files. Define services, networks, volumes in docker-compose.yml. One command starts the entire application stack.",
                            "Use for local development with multiple services (app, database, redis). docker-compose up starts all containers. Benefits: consistent environments, easy service linking, simplified networking."
                        ]
                    }
                ],
                'aws': [
                    {
                        "question": "Explain the difference between EC2, Lambda, and ECS.",
                        "difficulty": "Medium",
                        "answers": [
                            "EC2: virtual servers you manage. Lambda: serverless functions with auto-scaling. ECS: container orchestration service. Choose based on workload: persistent apps (EC2), event-driven (Lambda), containerized (ECS).",
                            "EC2 gives full control over instances. Lambda charges per execution, no server management. ECS runs Docker containers at scale. Lambda for short tasks, EC2 for traditional apps, ECS for microservices."
                        ]
                    },
                    {
                        "question": "What is the difference between S3 and EBS?",
                        "difficulty": "Easy",
                        "answers": [
                            "S3 is object storage for files (images, videos, backups) accessed via HTTP. EBS is block storage attached to EC2 instances like a hard drive. S3 is cheaper for large static files.",
                            "Use S3 for static content, backups, data lakes. Use EBS for database files, application data requiring low latency. S3 is replicated across regions automatically, EBS is single AZ."
                        ]
                    }
                ]
            }
            
            # General technical question templates for skills without specific questions
            general_tech_templates = [
                {
                    "question": "What are the key features and advantages of {skill}?",
                    "difficulty": "Easy",
                    "answers": [
                        "{skill} provides powerful features for modern development including scalability, maintainability, and developer productivity. Its ecosystem includes extensive libraries and strong community support.",
                        "The main advantages of {skill} are its performance, ease of use, and wide industry adoption. It solves common development challenges efficiently with proven patterns."
                    ]
                },
                {
                    "question": "Describe a real-world project where you used {skill}. What challenges did you face?",
                    "difficulty": "Medium",
                    "answers": [
                        "I built an e-commerce platform using {skill} where the main challenge was handling high traffic during sales. I implemented caching, optimized queries, and used load balancing to ensure smooth performance.",
                        "In a data processing pipeline with {skill}, I faced scalability issues. I refactored the architecture to use asynchronous processing and batch operations, improving throughput by 3x."
                    ]
                },
                {
                    "question": "How do you ensure code quality and follow best practices when working with {skill}?",
                    "difficulty": "Medium",
                    "answers": [
                        "I write comprehensive unit tests, follow coding standards, conduct code reviews, and use linters/formatters. I also document code thoroughly and refactor regularly to maintain clean architecture.",
                        "Best practices include modular design, error handling, security considerations, and performance optimization. I use CI/CD pipelines for automated testing and maintain up-to-date dependencies."
                    ]
                },
                {
                    "question": "What are common performance bottlenecks in {skill} applications and how do you optimize them?",
                    "difficulty": "Hard",
                    "answers": [
                        "Common bottlenecks include inefficient algorithms, database queries, memory leaks, and blocking I/O. I profile applications, optimize critical paths, implement caching, and use async operations where appropriate.",
                        "I identify bottlenecks through monitoring and profiling tools. Solutions include query optimization, connection pooling, caching strategies, CDN usage, and horizontal scaling."
                    ]
                },
                {
                    "question": "How do you stay updated with the latest developments and best practices in {skill}?",
                    "difficulty": "Easy",
                    "answers": [
                        "I follow official blogs, read documentation updates, participate in community forums, and attend conferences/webinars. I also experiment with new features in side projects.",
                        "I subscribe to newsletters, follow thought leaders on social media, contribute to open-source projects, and take online courses to continuously learn and apply new techniques."
                    ]
                }
            ]
            
            # Enhanced behavioral question templates
            behavioral_templates = [
                {
                    "question": "Describe a situation where you had to learn {skill} under a tight deadline. How did you approach it?",
                    "difficulty": "Medium",
                    "answers": [
                        "When assigned a project requiring {skill} with a 3-week deadline, I created a focused learning plan. I studied official documentation for 2 hours daily, built small prototypes, and asked for code reviews from experienced team members. I successfully delivered on time.",
                        "I prioritized learning the core concepts needed for immediate tasks while building a working prototype. I set up pair programming sessions with a colleague experienced in {skill} and completed online tutorials during evenings. This hands-on approach accelerated my learning."
                    ]
                },
                {
                    "question": "Tell me about a time when your expertise in {skill} helped solve a critical production issue.",
                    "difficulty": "Hard",
                    "answers": [
                        "Our production system experienced 80% performance degradation. Using my knowledge of {skill}'s internals, I quickly identified a memory leak in our caching layer. I implemented a fix and deployed within 2 hours, preventing revenue loss.",
                        "A critical bug in our {skill}-based service was causing data inconsistency. I analyzed logs, reproduced the issue locally, and discovered a race condition. My fix included proper synchronization and comprehensive testing to prevent recurrence."
                    ]
                },
                {
                    "question": "Describe how you mentored a junior developer in learning {skill}.",
                    "difficulty": "Medium",
                    "answers": [
                        "I created a structured learning path starting with fundamentals, provided hands-on exercises, and conducted weekly code review sessions. I paired with them on real tasks, explained my thought process, and encouraged questions. After 3 months, they were contributing independently.",
                        "I assessed their current knowledge level, identified gaps, and assigned progressively complex tasks. I shared resources, explained best practices during code reviews, and made myself available for questions. Their confidence and code quality improved significantly."
                    ]
                },
                {
                    "question": "Tell me about a disagreement you had with a team member regarding a {skill}-related technical decision.",
                    "difficulty": "Medium",
                    "answers": [
                        "We disagreed on whether to use approach A or B for implementing a feature in {skill}. I proposed we prototype both approaches with clear success criteria. We evaluated performance, maintainability, and complexity. The data-driven discussion led to consensus on the better solution.",
                        "A colleague wanted to use a different {skill} pattern than I suggested. Instead of arguing, I documented pros and cons of each approach, consulted with senior developers, and we agreed to use my approach for this project while keeping the other option for future consideration."
                    ]
                },
                {
                    "question": "Describe a time when you had to refactor a large codebase using {skill} while maintaining backward compatibility.",
                    "difficulty": "Hard",
                    "answers": [
                        "I led a 3-month refactoring effort of our {skill} application. I created a detailed plan, broke work into small incremental changes, maintained comprehensive test coverage, and used feature flags. We successfully migrated without downtime or breaking changes.",
                        "I identified the most problematic areas, wrote characterization tests, refactored in small steps, and got frequent code reviews. I created wrapper functions to maintain the old API while implementing new logic underneath. Gradual migration ensured stability."
                    ]
                }
            ]
            
            # Enhanced situational question templates
            situational_templates = [
                {
                    "question": "You discover a security vulnerability in your {skill} application two days before a major release. What would you do?",
                    "difficulty": "Hard",
                    "answers": [
                        "I would immediately assess the severity and scope of the vulnerability. If critical, I'd recommend delaying the release, inform stakeholders with a risk assessment, develop and test a fix, and implement it. Security cannot be compromised for deadlines.",
                        "I'd quantify the risk, explore if a workaround exists, and present options to stakeholders: delay release, limited rollout, or temporary mitigation. I'd document the issue, fix it properly, and add security tests to prevent similar issues."
                    ]
                },
                {
                    "question": "Your team wants to migrate from an existing solution to {skill}, but you have concerns about the transition. How would you handle this?",
                    "difficulty": "Medium",
                    "answers": [
                        "I'd voice my concerns with specific data points: migration effort, learning curve, compatibility issues. I'd propose a proof of concept to validate assumptions, create a risk matrix, and suggest a phased migration plan if we proceed.",
                        "I'd research and document both benefits and challenges, compare with current solution objectively, suggest running {skill} for a non-critical component first, and gather metrics before full migration. Evidence-based decisions reduce risk."
                    ]
                },
                {
                    "question": "You're assigned to work on a {skill} project, but the codebase has no documentation and the original developer has left. How would you proceed?",
                    "difficulty": "Medium",
                    "answers": [
                        "I'd start by reading the code to understand architecture, run the application locally, trace execution flow for key features, write tests for critical paths, and document as I learn. I'd also check version control history for context.",
                        "I'd analyze the project structure, identify entry points, use debugging tools to trace logic, create architecture diagrams, and write documentation while adding features. This helps future developers and builds my understanding."
                    ]
                },
                {
                    "question": "How would you convince management to invest in upgrading the {skill} version or refactoring technical debt?",
                    "difficulty": "Hard",
                    "answers": [
                        "I'd quantify the business impact: reduced development velocity, increased bug rates, security risks, and maintenance costs. I'd present a cost-benefit analysis showing how investment now saves money long-term and enables faster feature development.",
                        "I'd create a presentation with concrete examples of how technical debt slows features, increases bugs, and poses security risks. I'd propose a phased approach with measurable milestones and demonstrate ROI through improved team productivity."
                    ]
                },
                {
                    "question": "A critical {skill} service is experiencing intermittent failures in production. How would you debug and resolve this?",
                    "difficulty": "Hard",
                    "answers": [
                        "I'd gather data: logs, metrics, error patterns, and timing. I'd attempt to reproduce the issue, analyze resource usage during failures, check recent deployments, and review code changes. I'd implement additional monitoring and logging if needed to narrow down the root cause.",
                        "I'd check monitoring dashboards for anomalies, review application and system logs, analyze database performance, examine network issues, and check for resource constraints. I'd create hypotheses, test them systematically, and implement fixes with proper monitoring."
                    ]
                }
            ]
            
            # Generate questions for each skill
            for skill in skills[:6]:  # Limit to top 6 skills
                skill_lower = skill.lower()
                
                # Check if we have specific questions for this skill
                if skill_lower in skill_specific_questions:
                    for q in skill_specific_questions[skill_lower]:
                        technical_questions.append({
                            'question': q['question'],
                            'skill': skill,
                            'difficulty': q['difficulty'],
                            'answers': q['answers']
                        })
                else:
                    # Use general templates
                    for template in general_tech_templates[:3]:  # Limit to 3 general questions per skill
                        technical_questions.append({
                            'question': template['question'].format(skill=skill),
                            'skill': skill,
                            'difficulty': template['difficulty'],
                            'answers': [answer.format(skill=skill) for answer in template['answers']]
                        })
                
                # Add behavioral questions (2 per skill)
                for template in behavioral_templates[:2]:
                    behavioral_questions.append({
                        'question': template['question'].format(skill=skill),
                        'skill': skill,
                        'difficulty': template['difficulty'],
                        'answers': [answer.format(skill=skill) for answer in template['answers']]
                    })
                
                # Add situational questions (2 per skill)
                for template in situational_templates[:2]:
                    situational_questions.append({
                        'question': template['question'].format(skill=skill),
                        'skill': skill,
                        'difficulty': template['difficulty'],
                        'answers': [answer.format(skill=skill) for answer in template['answers']]
                    })
            
            return JsonResponse({
                'technical_questions': technical_questions[:15],  # Return top 15 technical
                'behavioral_questions': behavioral_questions[:8],  # Return top 8 behavioral
                'situational_questions': situational_questions[:8],  # Return top 8 situational
            })
        except Exception as e:
            print(f"Error in InterviewKitView: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class HistoryView(View):
    def get(self, request):
        try:
            # Get all analyses ordered by creation date
            analyses = Analysis.objects.select_related('resume', 'jd').order_by('-created_at')
            
            history = []
            for analysis in analyses:
                history.append({
                    'id': analysis.id,
                    'match_score': analysis.match_score,
                    'missing_skills': analysis.missing_skills,
                    'created_at': analysis.created_at.isoformat()
                })
            
            return JsonResponse({'history': history})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class CompareView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            file1_id = data.get('file1_id')
            file2_id = data.get('file2_id')
            
            file1 = Resume.objects.get(id=file1_id)
            file2 = Resume.objects.get(id=file2_id)
            
            # Extract text if not already done
            text1 = file1.extracted_text or TextExtractor.extract_text_from_file(file1.file.path)
            text2 = file2.extracted_text or TextExtractor.extract_text_from_file(file2.file.path)
            
            # Use ML analysis for better comparison
            analyzer = ResumeAnalyzer()
            result1 = analyzer.perform_comprehensive_analysis(text1, "")
            result2 = analyzer.perform_comprehensive_analysis(text2, "")
            
            # Calculate similarity
            match_score = calculate_similarity(text1, text2)
            
            # Find common and unique skills
            skills1 = result1['resume_skills']
            skills2 = result2['resume_skills']
            common_skills = list(set(skills1) & set(skills2))
            unique_to_file1 = list(set(skills1) - set(skills2))
            unique_to_file2 = list(set(skills2) - set(skills1))
            
            # Create frequency maps for visualization
            from collections import Counter
            freq1 = dict(Counter(skills1))
            freq2 = dict(Counter(skills2))
            
            return JsonResponse({
                'similarity_score': match_score,
                'file1_skills': skills1,
                'file2_skills': skills2,
                'common_skills': common_skills,
                'unique_to_file1': unique_to_file1,
                'unique_to_file2': unique_to_file2,
                'file1_keyword_freq': freq1,
                'file2_keyword_freq': freq2
            })
        except Resume.DoesNotExist:
            return JsonResponse({'error': 'One or both files not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class HealthCheckView(View):
    def get(self, request):
        return JsonResponse({
            'status': 'healthy',
            'message': 'ProFileMatch backend is running successfully'
        })
