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
from .ml_analysis import ResumeAnalyzer, TextExtractor, calculate_similarity
from .job_fetcher import fetch_jobs_from_adzuna, fetch_youtube_videos
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
                
                try:
                    response = requests.get(url, params=params)
                    if response.status_code == 200:
                        data = response.json()
                        for result in data.get('results', []):
                            job = {
                                'title': result.get('title', ''),
                                'company': result.get('company', {}).get('display_name', ''),
                                'location': result.get('location', {}).get('display_name', ''),
                                'salary': '',
                                'apply_link': result.get('redirect_url', ''),
                            }
                            
                            # Format salary if available
                            salary_obj = result.get('salary_min')
                            if salary_obj:
                                job['salary'] = f"₹{salary_obj:,}"
                            
                            # Avoid duplicates
                            if job not in jobs:
                                jobs.append(job)
                                
                            # Limit total jobs
                            if len(jobs) >= 10:
                                break
                
                except Exception as e:
                    print(f"Error fetching jobs for skill {skill}: {e}")
                
                if len(jobs) >= 10:
                    break
            
            # If we still don't have enough jobs, try a combined query
            if len(jobs) < 10 and len(skills) > 1:
                # Join skills for a broader query
                query = ' '.join(skills[:5])  # Limit to first 5 skills
                url = f'https://api.adzuna.com/v1/api/jobs/{country}/search/1'
                params = {
                    'app_id': app_id,
                    'app_key': app_key,
                    'results_per_page': 10 - len(jobs),
                    'what': query,
                    'content-type': 'application/json'
                }
                
                try:
                    response = requests.get(url, params=params)
                    if response.status_code == 200:
                        data = response.json()
                        for result in data.get('results', []):
                            job = {
                                'title': result.get('title', ''),
                                'company': result.get('company', {}).get('display_name', ''),
                                'location': result.get('location', {}).get('display_name', ''),
                                'salary': '',
                                'apply_link': result.get('redirect_url', ''),
                            }
                            
                            # Format salary if available
                            salary_obj = result.get('salary_min')
                            if salary_obj:
                                job['salary'] = f"₹{salary_obj:,}"
                            
                            # Avoid duplicates
                            if job not in jobs:
                                jobs.append(job)
                                
                            # Limit total jobs
                            if len(jobs) >= 10:
                                break
                except Exception as e:
                    print(f"Error fetching jobs for combined query: {e}")
        
        # If we still don't have jobs, fetch some general tech jobs
        if len(jobs) == 0:
            url = f'https://api.adzuna.com/v1/api/jobs/{country}/search/1'
            params = {
                'app_id': app_id,
                'app_key': app_key,
                'results_per_page': 10,
                'what': 'technology',
                'content-type': 'application/json'
            }
            
            try:
                response = requests.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    for result in data.get('results', []):
                        job = {
                            'title': result.get('title', ''),
                            'company': result.get('company', {}).get('display_name', ''),
                            'location': result.get('location', {}).get('display_name', ''),
                            'salary': '',
                            'apply_link': result.get('redirect_url', ''),
                        }
                        
                        # Format salary if available
                        salary_obj = result.get('salary_min')
                        if salary_obj:
                            job['salary'] = f"₹{salary_obj:,}"
                        
                        jobs.append(job)
            except Exception as e:
                print(f"Error fetching general tech jobs: {e}")
        
        return jobs
    except Exception as e:
        print(f"Error fetching jobs: {e}")
    
    return []

def fetch_youtube_videos(skills):
    """Fetch YouTube tutorials for skills"""
    try:
        from googleapiclient.discovery import build
        
        api_key = settings.YOUTUBE_API_KEY
        service_name = 'youtube'
        version = 'v3'
        
        videos = {}
        
        if not api_key:
            return videos
            
        youtube = build(service_name, version, developerKey=api_key)
        
        for skill in skills[:5]:  # Limit to first 5 skills
            search_response = youtube.search().list(
                q=f"{skill} tutorial",
                part='snippet',
                type='video',
                maxResults=3
            ).execute()
            
            videos[skill] = []
            for search_result in search_response.get('items', []):
                video = {
                    'title': search_result['snippet']['title'],
                    'url': f"https://www.youtube.com/watch?v={search_result['id']['videoId']}",
                    'thumbnail': search_result['snippet']['thumbnails']['default']['url']
                }
                videos[skill].append(video)
    except Exception as e:
        print(f"Error fetching YouTube videos: {e}")
        videos = {}
    
    return videos

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
            
            # Sample questions with answers (in a real app, these would come from a database)
            tech_templates = [
                {
                    "question": "Explain the concept of {skill}.",
                    "answers": [
                        "{skill} is a technology that allows developers to build applications efficiently. It provides a framework for organizing code and managing dependencies.",
                        "At its core, {skill} is designed to solve specific problems in software development. It offers features like modularity, reusability, and scalability."
                    ]
                },
                {
                    "question": "What are the advantages and disadvantages of using {skill}?",
                    "answers": [
                        "Advantages include ease of use, strong community support, and extensive documentation. Disadvantages might be performance limitations or learning curve.",
                        "The pros of {skill} are its flexibility and wide adoption. The cons could include complexity in large applications or compatibility issues."
                    ]
                },
                {
                    "question": "How would you implement a solution using {skill}?",
                    "answers": [
                        "First, I would analyze the requirements and design the architecture. Then, I'd set up the development environment and start with core components.",
                        "I'd begin by breaking down the problem into smaller tasks, then use {skill}'s features to implement each component, followed by testing and optimization."
                    ]
                },
                {
                    "question": "Describe a challenging problem you solved using {skill}.",
                    "answers": [
                        "I once had to optimize a slow-performing module. I used {skill}'s profiling tools to identify bottlenecks and refactored the code for better efficiency.",
                        "In a previous project, I faced integration issues with legacy systems. I leveraged {skill}'s compatibility features to bridge the gap successfully."
                    ]
                },
                {
                    "question": "What are the best practices for {skill}?",
                    "answers": [
                        "Following coding standards, writing unit tests, and keeping dependencies up-to-date are essential. Documentation and code reviews are also important.",
                        "Modular design, error handling, and performance optimization should be priorities. Regular updates and security checks are also recommended."
                    ]
                }
            ]
            
            behavioral_templates = [
                {
                    "question": "Tell me about a time you had to learn {skill} quickly.",
                    "answers": [
                        "When my team decided to adopt {skill} for a new project, I dedicated 2 hours daily to learning through documentation and tutorials. Within a month, I was contributing effectively.",
                        "I had to pick up {skill} for a tight deadline project. I focused on core concepts first, then practiced with small examples before applying it to the actual work."
                    ]
                },
                {
                    "question": "Describe a situation where your knowledge of {skill} helped your team.",
                    "answers": [
                        "During a critical bug fix, my understanding of {skill}'s internals helped identify the root cause quickly, saving the team several hours of debugging.",
                        "I mentored junior developers on {skill}, which improved the overall team productivity and code quality for our project."
                    ]
                },
                {
                    "question": "How do you stay updated with the latest developments in {skill}?",
                    "answers": [
                        "I follow official blogs, join community forums, and attend webinars related to {skill}. I also experiment with new features in personal projects.",
                        "I subscribe to newsletters, participate in online communities, and contribute to open-source projects involving {skill} to stay current."
                    ]
                },
                {
                    "question": "Tell me about a time you had to debug a complex issue in {skill}.",
                    "answers": [
                        "I encountered a memory leak issue in a {skill} application. I used profiling tools to trace the problem to improper resource management and fixed it by implementing proper cleanup.",
                        "A performance issue in our {skill}-based system was traced to inefficient database queries. I optimized them and improved response times by 60%."
                    ]
                },
                {
                    "question": "Describe how you would mentor someone new to {skill}.",
                    "answers": [
                        "I would start with fundamentals, provide hands-on exercises, and gradually introduce advanced concepts. Regular code reviews and feedback sessions would ensure progress.",
                        "My approach would be to understand their background, create a learning path, and provide practical examples. I'd encourage questions and offer continuous support."
                    ]
                }
            ]
            
            situational_templates = [
                {
                    "question": "How would you handle a situation where your {skill} solution didn't work as expected?",
                    "answers": [
                        "I would first analyze the error logs and documentation to understand the issue. Then, I'd explore alternative approaches or seek help from the community if needed.",
                        "I'd systematically troubleshoot by isolating the problem, testing assumptions, and consulting resources. If necessary, I'd consider different technologies."
                    ]
                },
                {
                    "question": "If you had to choose between two {skill} approaches, how would you decide?",
                    "answers": [
                        "I'd evaluate factors like project requirements, team expertise, maintenance costs, and scalability. I'd also consider community support and long-term viability.",
                        "I'd create a proof of concept for each approach, compare performance and complexity, and consult with team members before making a decision."
                    ]
                },
                {
                    "question": "How would you explain {skill} to a non-technical stakeholder?",
                    "answers": [
                        "I'd use analogies and real-world examples to explain how {skill} solves business problems. I'd focus on benefits rather than technical details.",
                        "I'd relate {skill} to familiar concepts and emphasize its impact on project outcomes, like faster delivery or improved user experience."
                    ]
                },
                {
                    "question": "What would you do if a team member was struggling with {skill}?",
                    "answers": [
                        "I'd offer one-on-one mentoring, share learning resources, and pair program with them on tasks involving {skill} to build their confidence.",
                        "I'd assess their specific challenges, provide targeted guidance, and suggest breaking down complex tasks into manageable steps."
                    ]
                },
                {
                    "question": "How would you optimize a {skill}-based system for better performance?",
                    "answers": [
                        "I'd profile the system to identify bottlenecks, optimize database queries, implement caching, and consider horizontal scaling options.",
                        "I'd analyze resource usage, refactor inefficient code, and leverage {skill}'s built-in optimization features to improve performance."
                    ]
                }
            ]
            
            # Generate questions for top 5 skills
            for skill in skills[:5]:
                for template in tech_templates:
                    technical_questions.append({
                        'question': template['question'].format(skill=skill),
                        'skill': skill,
                        'difficulty': 'Medium',
                        'answers': [answer.format(skill=skill) for answer in template['answers']]
                    })
                
                for template in behavioral_templates:
                    behavioral_questions.append({
                        'question': template['question'].format(skill=skill),
                        'skill': skill,
                        'difficulty': 'Medium',
                        'answers': [answer.format(skill=skill) for answer in template['answers']]
                    })
                
                for template in situational_templates:
                    situational_questions.append({
                        'question': template['question'].format(skill=skill),
                        'skill': skill,
                        'difficulty': 'Medium',
                        'answers': [answer.format(skill=skill) for answer in template['answers']]
                    })
            
            # Fetch YouTube tutorials
            youtube_videos = fetch_youtube_videos(skills)
            
            return JsonResponse({
                'technical_questions': technical_questions[:10],  # Limit to 10
                'behavioral_questions': behavioral_questions[:5],  # Limit to 5
                'situational_questions': situational_questions[:5],  # Limit to 5
                'youtube_videos': youtube_videos
            })
        except Exception as e:
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
