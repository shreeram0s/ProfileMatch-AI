import pdfplumber
import docx2txt
import spacy
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import nltk
import re
from collections import Counter
import string

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

class TextExtractor:
    @staticmethod
    def extract_text_from_file(file_path):
        """Extract text from PDF, DOC/DOCX, or TXT files"""
        text = ""
        try:
            if file_path.endswith('.pdf'):
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        text += page.extract_text() or ""
            elif file_path.endswith('.docx'):
                text = docx2txt.process(file_path)
            elif file_path.endswith('.doc'):
                text = docx2txt.process(file_path)
            elif file_path.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
        except Exception as e:
            print(f"Error extracting text: {e}")
        return text

class TextPreprocessor:
    def __init__(self):
        # Load spaCy model if available
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.use_spacy = True
        except OSError:
            self.nlp = None
            self.use_spacy = False
        
        # Initialize NLTK components
        self.lemmatizer = WordNetLemmatizer()
        try:
            self.stop_words = set(stopwords.words('english'))
        except LookupError:
            self.stop_words = set()
        # Add custom resume-related stopwords
        self.custom_stopwords = {
            'job', 'work', 'experience', 'skill', 'ability', 'knowledge', 'responsibility',
            'duty', 'task', 'role', 'position', 'company', 'organization', 'team', 'project',
            'year', 'month', 'education', 'degree', 'university', 'college', 'school',
            'qualification', 'certification', 'certificate', 'training', 'course',
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
            "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves',
            'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself',
            'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves'
        }
        self.stop_words.update(self.custom_stopwords)
    
    def preprocess_text(self, text):
        """Preprocess text using spaCy (primary) or NLTK (fallback)"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation and special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        
        if self.use_spacy and self.nlp:
            # Use spaCy for preprocessing
            doc = self.nlp(text)
            tokens = [
                token.lemma_ for token in doc 
                if token.pos_ in ['NOUN', 'PROPN', 'ADJ', 'VERB'] 
                and token.lemma_ not in self.stop_words 
                and len(token.lemma_) > 2
            ]
        else:
            # Fallback to NLTK
            try:
                tokens = word_tokenize(text)
            except LookupError:
                tokens = re.findall(r'\b\w+\b', text)
            tokens = [
                self.lemmatizer.lemmatize(token) 
                for token in tokens 
                if token not in self.stop_words 
                and len(token) > 2
                and token not in string.punctuation
            ]
        
        return ' '.join(tokens)

# Curated skill dictionaries
technical_skills = {
    # Programming Languages
    'python', 'java', 'javascript', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
    'php', 'ruby', 'scala', 'r', 'matlab', 'sql', 'typescript', 'dart', 'perl',
    
    # Web Technologies
    'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
    'flask', 'spring', 'laravel', 'asp.net', 'ruby on rails', 'next.js', 'nuxt.js',
    'svelte', 'jquery', 'bootstrap', 'tailwind', 'sass', 'less',
    
    # Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase',
    'oracle', 'sql server', 'cassandra', 'couchbase', 'dynamodb',
    
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github',
    'ansible', 'terraform', 'puppet', 'chef', 'openshift', 'heroku', 'vercel',
    
    # Data Science & ML
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras',
    'matplotlib', 'seaborn', 'plotly', 'tableau', 'power bi', 'spark', 'hadoop',
    
    # Mobile Development
    'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic',
    
    # Other Technologies
    'linux', 'ubuntu', 'centos', 'bash', 'powershell', 'git', 'svn', 'agile',
    'scrum', 'kanban', 'jira', 'confluence', 'slack', 'trello', 'notion'
}

soft_skills = {
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'creativity', 'adaptability', 'time management', 'organization', 'planning',
    'decision making', 'negotiation', 'conflict resolution', 'empathy', 'patience',
    'reliability', 'work ethic', 'initiative', 'self-motivation', 'attention to detail',
    'customer service', 'interpersonal skills', 'presentation skills', 'public speaking',
    'mentoring', 'coaching', 'delegation', 'project management', 'risk management',
    'strategic thinking', 'innovation', 'flexibility', 'resilience', 'stress management'
}

class SkillExtractor:
    @staticmethod
    def extract_skills_from_text(text):
        """Extract technical and soft skills from text"""
        if not text:
            return [], [], []
        
        text_lower = text.lower()
        found_technical = []
        found_soft = []
        
        # Extract technical skills
        for skill in technical_skills:
            if skill in text_lower:
                found_technical.append(skill)
        
        # Extract soft skills
        for skill in soft_skills:
            if skill in text_lower:
                found_soft.append(skill)
        
        # Combine all skills
        all_skills = list(set(found_technical + found_soft))
        
        return found_technical, found_soft, all_skills
    
    @staticmethod
    def extract_company_info(text):
        """Extract company name, job title, and location from job description"""
        if not text:
            return None, None, None
        
        company_name = None
        job_title = None
        location = None
        
        # Try to load spaCy for NER
        try:
            nlp = spacy.load("en_core_web_sm")
            doc = nlp(text[:2000])  # Process first 2000 characters for efficiency
            
            # Extract organization entities
            organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
            if organizations:
                company_name = organizations[0]  # Take first organization mentioned
            
            # Extract location
            locations = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]
            if locations:
                location = locations[0]
            
        except Exception as e:
            print(f"Error in NER extraction: {e}")
        
        # Fallback: Extract from common patterns
        if not company_name:
            # Look for patterns like "at [Company]" or "[Company] is hiring"
            patterns = [
                r'at\s+([A-Z][A-Za-z\s&.]+?)(?:\s+is|\s+seeks|\s+looking|,|\.|$)',
                r'([A-Z][A-Za-z\s&.]+?)\s+is\s+(?:hiring|seeking|looking)',
                r'join\s+([A-Z][A-Za-z\s&.]+?)(?:\s+as|\s+team|,)',
                r'Company:\s*([A-Z][A-Za-z\s&.]+)',
            ]
            
            for pattern in patterns:
                match = re.search(pattern, text[:500])
                if match:
                    company_name = match.group(1).strip()
                    break
        
        # Extract job title from common patterns
        title_patterns = [
            r'(?:job title|position|role):\s*([A-Za-z\s-]+)',
            r'(?:hiring|seeking|looking for)\s+(?:a\s+)?([A-Z][A-Za-z\s-]+?)(?:\s+to|\s+for|\s+with)',
            r'^([A-Z][A-Za-z\s-]+)\s+(?:position|role|job)',
        ]
        
        for pattern in title_patterns:
            match = re.search(pattern, text[:500], re.MULTILINE)
            if match:
                job_title = match.group(1).strip()
                break
        
        return company_name, job_title, location
    
    @staticmethod
    def extract_skills_from_job_description(text):
        """Extract skills from job description with priority scoring"""
        if not text:
            return [], {}, []
        
        text_lower = text.lower()
        found_skills = []
        skill_priorities = {}
        
        # Extract all skills
        for skill in technical_skills.union(soft_skills):
            if skill in text_lower:
                found_skills.append(skill)
                # Calculate priority score
                frequency = text_lower.count(skill)
                # Boost for emphasis words
                emphasis_boost = 0
                emphasis_words = ['required', 'must have', 'essential', 'critical', 'key', 'necessary']
                for word in emphasis_words:
                    if word in text_lower[max(0, text_lower.find(skill)-50):text_lower.find(skill)+50]:
                        emphasis_boost += 1
                priority_score = frequency + emphasis_boost
                skill_priorities[skill] = priority_score
        
        # Sort by priority
        sorted_skills = sorted(skill_priorities.items(), key=lambda x: x[1], reverse=True)
        sorted_skill_dict = dict(sorted_skills)
        
        return found_skills, sorted_skill_dict, list(sorted_skill_dict.keys())

class EmbeddingAnalyzer:
    def __init__(self):
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.use_sentence_transformers = True
        except Exception:
            self.model = None
            self.use_sentence_transformers = False
    
    def calculate_semantic_similarity(self, text1, text2):
        """Calculate semantic similarity using SentenceTransformers or TF-IDF"""
        if not text1 or not text2:
            return 0.0
        
        if self.use_sentence_transformers and self.model:
            try:
                embeddings = self.model.encode([text1, text2])
                from sklearn.metrics.pairwise import cosine_similarity
                similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
                return similarity * 100
            except Exception:
                pass
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return similarity * 100

class YouTubeRecommendationEngine:
    def __init__(self, api_key):
        self.api_key = api_key
        self.seen_video_ids = set()  # Track seen video IDs to prevent duplicates
        self.quota_exceeded = False  # Track if quota is exceeded
    
    def _get_fallback_recommendations(self, skills, max_skills=10):
        """Generate fallback recommendations when API is unavailable"""
        print("📺 Using fallback video recommendations (API quota exceeded)")
        
        # Curated high-quality tutorial videos for common skills
        fallback_videos = {
            'python': [
                {
                    'video_id': 'rfscVS0vtbw',
                    'title': 'Learn Python - Full Course for Beginners [Tutorial]',
                    'url': 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                    'thumbnail': 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'This course will give you a full introduction into all of the core concepts in python.',
                    'skill': 'python'
                },
                {
                    'video_id': '_uQrJ0TkZlc',
                    'title': 'Python Tutorial - Python Full Course for Beginners',
                    'url': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                    'thumbnail': 'https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'Python tutorial for beginners - Learn Python for machine learning, web development, and more.',
                    'skill': 'python'
                },
                {
                    'video_id': 'kqtD5dpn9C8',
                    'title': 'Python for Everybody - Full University Python Course',
                    'url': 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
                    'thumbnail': 'https://i.ytimg.com/vi/kqtD5dpn9C8/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'This Python 3 tutorial course aims to teach everyone the basics of programming computers using Python.',
                    'skill': 'python'
                }
            ],
            'javascript': [
                {
                    'video_id': 'PkZNo7MFNFg',
                    'title': 'Learn JavaScript - Full Course for Beginners',
                    'url': 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
                    'thumbnail': 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'This complete 134-part JavaScript tutorial for beginners will teach you everything you need to know to get started.',
                    'skill': 'javascript'
                },
                {
                    'video_id': 'W6NZfCO5SIk',
                    'title': 'JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour',
                    'url': 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                    'thumbnail': 'https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'JavaScript tutorial for beginners. Learn JavaScript basics in just 1 hour!',
                    'skill': 'javascript'
                },
                {
                    'video_id': 'jS4aFq5-91M',
                    'title': 'JavaScript Programming - Full Course',
                    'url': 'https://www.youtube.com/watch?v=jS4aFq5-91M',
                    'thumbnail': 'https://i.ytimg.com/vi/jS4aFq5-91M/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn JavaScript from scratch by solving over a hundred different coding challenges.',
                    'skill': 'javascript'
                }
            ],
            'java': [
                {
                    'video_id': 'eIrMbAQWlgI',
                    'title': 'Java Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=eIrMbAQWlgI',
                    'thumbnail': 'https://i.ytimg.com/vi/eIrMbAQWlgI/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'Learn Java 8 and object oriented programming with this complete Java tutorial for beginners.',
                    'skill': 'java'
                },
                {
                    'video_id': 'xk4_1vDrzzo',
                    'title': 'Java Full Course for free',
                    'url': 'https://www.youtube.com/watch?v=xk4_1vDrzzo',
                    'thumbnail': 'https://i.ytimg.com/vi/xk4_1vDrzzo/hqdefault.jpg',
                    'channel': 'Bro Code',
                    'description': 'Java tutorial for beginners full course #java #tutorial #beginners',
                    'skill': 'java'
                },
                {
                    'video_id': 'A74TOX803D0',
                    'title': 'Java Full Course for Beginners',
                    'url': 'https://www.youtube.com/watch?v=A74TOX803D0',
                    'thumbnail': 'https://i.ytimg.com/vi/A74TOX803D0/hqdefault.jpg',
                    'channel': 'Amigoscode',
                    'description': 'Learn Java programming from scratch with this comprehensive course.',
                    'skill': 'java'
                }
            ],
            'c++': [
                {
                    'video_id': '8jLOx1hD3_o',
                    'title': 'C++ Programming Course - Beginner to Advanced',
                    'url': 'https://www.youtube.com/watch?v=8jLOx1hD3_o',
                    'thumbnail': 'https://i.ytimg.com/vi/8jLOx1hD3_o/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn C++ programming from scratch in this full course.',
                    'skill': 'c++'
                },
                {
                    'video_id': 'ZzaPdXTrSb8',
                    'title': 'C++ Tutorial for Beginners - Learn C++ in 1 Hour',
                    'url': 'https://www.youtube.com/watch?v=ZzaPdXTrSb8',
                    'thumbnail': 'https://i.ytimg.com/vi/ZzaPdXTrSb8/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'C++ tutorial for beginners. Learn C++ programming language basics in one hour.',
                    'skill': 'c++'
                }
            ],
            'c#': [
                {
                    'video_id': 'GhQdlIFylQ8',
                    'title': 'C# Full Course for free',
                    'url': 'https://www.youtube.com/watch?v=GhQdlIFylQ8',
                    'thumbnail': 'https://i.ytimg.com/vi/GhQdlIFylQ8/hqdefault.jpg',
                    'channel': 'Bro Code',
                    'description': 'C# tutorial for beginners full course',
                    'skill': 'c#'
                },
                {
                    'video_id': 'gfkTfcpWqAY',
                    'title': 'C# Tutorial For Beginners - Learn C# Basics in 1 Hour',
                    'url': 'https://www.youtube.com/watch?v=gfkTfcpWqAY',
                    'thumbnail': 'https://i.ytimg.com/vi/gfkTfcpWqAY/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'C# tutorial for beginners. Learn C# and .NET basics.',
                    'skill': 'c#'
                }
            ],
            'sql': [
                {
                    'video_id': '7S_tz1z_5bA',
                    'title': 'SQL Tutorial - Full Database Course for Beginners',
                    'url': 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
                    'thumbnail': 'https://i.ytimg.com/vi/7S_tz1z_5bA/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'Learn SQL from scratch in this full course for beginners.',
                    'skill': 'sql'
                },
                {
                    'video_id': 'HXV3zeQKqGY',
                    'title': 'SQL Tutorial - Full Course for Beginners',
                    'url': 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
                    'thumbnail': 'https://i.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn SQL in this full course for beginners.',
                    'skill': 'sql'
                }
            ],
            'html': [
                {
                    'video_id': 'kUMe1FH4CHE',
                    'title': 'HTML Full Course - Build a Website Tutorial',
                    'url': 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
                    'thumbnail': 'https://i.ytimg.com/vi/kUMe1FH4CHE/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn HTML in this full course for beginners.',
                    'skill': 'html'
                },
                {
                    'video_id': 'qz0aGYrrlhU',
                    'title': 'HTML Tutorial for Beginners: HTML Crash Course',
                    'url': 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
                    'thumbnail': 'https://i.ytimg.com/vi/qz0aGYrrlhU/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'HTML tutorial for beginners. Learn HTML basics.',
                    'skill': 'html'
                }
            ],
            'css': [
                {
                    'video_id': '1Rs2ND1ryYc',
                    'title': 'CSS Tutorial - Zero to Hero (Complete Course)',
                    'url': 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
                    'thumbnail': 'https://i.ytimg.com/vi/1Rs2ND1ryYc/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn CSS in this full course for beginners.',
                    'skill': 'css'
                },
                {
                    'video_id': 'G3e-cpL7ofc',
                    'title': 'HTML & CSS Full Course - Beginner to Pro',
                    'url': 'https://www.youtube.com/watch?v=G3e-cpL7ofc',
                    'thumbnail': 'https://i.ytimg.com/vi/G3e-cpL7ofc/hqdefault.jpg',
                    'channel': 'SuperSimpleDev',
                    'description': 'HTML and CSS tutorial for beginners.',
                    'skill': 'css'
                }
            ],
            'docker': [
                {
                    'video_id': 'fqMOX6JJhGo',
                    'title': 'Docker - Beginner\'s Course',
                    'url': 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
                    'thumbnail': 'https://i.ytimg.com/vi/fqMOX6JJhGo/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn Docker in this full course for beginners.',
                    'skill': 'docker'
                },
                {
                    'video_id': 'pTFZFxd4hOI',
                    'title': 'Docker Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=pTFZFxd4hOI',
                    'thumbnail': 'https://i.ytimg.com/vi/pTFZFxd4hOI/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'Docker tutorial for beginners. Learn Docker basics.',
                    'skill': 'docker'
                }
            ],
            'aws': [
                {
                    'video_id': '3hLmDS179YE',
                    'title': 'AWS Cloud Practitioner - Essentials',
                    'url': 'https://www.youtube.com/watch?v=3hLmDS179YE',
                    'thumbnail': 'https://i.ytimg.com/vi/3hLmDS179YE/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn AWS Cloud Practitioner basics.',
                    'skill': 'aws'
                },
                {
                    'video_id': 'k1RI5locZE4',
                    'title': 'AWS Basics for Beginners - Full Course',
                    'url': 'https://www.youtube.com/watch?v=k1RI5locZE4',
                    'thumbnail': 'https://i.ytimg.com/vi/k1RI5locZE4/hqdefault.jpg',
                    'channel': 'Simplilearn',
                    'description': 'Learn AWS basics in this full course.',
                    'skill': 'aws'
                }
            ],
            'git': [
                {
                    'video_id': 'RGOj5yH7evk',
                    'title': 'Git and GitHub for Beginners - Crash Course',
                    'url': 'https://www.youtube.com/watch?v=RGOj5yH7evk',
                    'thumbnail': 'https://i.ytimg.com/vi/RGOj5yH7evk/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn Git and GitHub in this full course.',
                    'skill': 'git'
                },
                {
                    'video_id': '8JJ101D3knE',
                    'title': 'Git Tutorial for Beginners: Learn Git in 1 Hour',
                    'url': 'https://www.youtube.com/watch?v=8JJ101D3knE',
                    'thumbnail': 'https://i.ytimg.com/vi/8JJ101D3knE/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'Git tutorial for beginners. Learn Git basics.',
                    'skill': 'git'
                }
            ],
            'typescript': [
                {
                    'video_id': '30LWjhZzg50',
                    'title': 'TypeScript - The Basics',
                    'url': 'https://www.youtube.com/watch?v=30LWjhZzg50',
                    'thumbnail': 'https://i.ytimg.com/vi/30LWjhZzg50/hqdefault.jpg',
                    'channel': 'Fireship',
                    'description': 'Learn TypeScript basics in this quick tutorial.',
                    'skill': 'typescript'
                },
                {
                    'video_id': 'd56mG7DezGs',
                    'title': 'TypeScript Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=d56mG7DezGs',
                    'thumbnail': 'https://i.ytimg.com/vi/d56mG7DezGs/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'TypeScript tutorial for beginners.',
                    'skill': 'typescript'
                }
            ],
            'angular': [
                {
                    'video_id': '3qBXWUpoPHo',
                    'title': 'Angular Full Course - Beginner to Pro',
                    'url': 'https://www.youtube.com/watch?v=3qBXWUpoPHo',
                    'thumbnail': 'https://i.ytimg.com/vi/3qBXWUpoPHo/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn Angular in this full course.',
                    'skill': 'angular'
                },
                {
                    'video_id': 'k5E2AVpwsko',
                    'title': 'Angular Tutorial for Beginners: Learn Angular & TypeScript',
                    'url': 'https://www.youtube.com/watch?v=k5E2AVpwsko',
                    'thumbnail': 'https://i.ytimg.com/vi/k5E2AVpwsko/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'Angular tutorial for beginners.',
                    'skill': 'angular'
                }
            ],
            'vue': [
                {
                    'video_id': 'FXpIoQ_rT_c',
                    'title': 'Vue.js 3 - The Full Course',
                    'url': 'https://www.youtube.com/watch?v=FXpIoQ_rT_c',
                    'thumbnail': 'https://i.ytimg.com/vi/FXpIoQ_rT_c/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn Vue.js 3 in this full course.',
                    'skill': 'vue'
                }
            ],
            'mongodb': [
                {
                    'video_id': 'ofme2o29ngU',
                    'title': 'MongoDB Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=ofme2o29ngU',
                    'thumbnail': 'https://i.ytimg.com/vi/ofme2o29ngU/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'MongoDB tutorial for beginners.',
                    'skill': 'mongodb'
                }
            ],
            'postgresql': [
                {
                    'video_id': 'qw--VYLpxG4',
                    'title': 'PostgreSQL Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=qw--VYLpxG4',
                    'thumbnail': 'https://i.ytimg.com/vi/qw--VYLpxG4/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn PostgreSQL in this full course.',
                    'skill': 'postgresql'
                }
            ],
            'flask': [
                {
                    'video_id': 'Z1RJmh_OqeA',
                    'title': 'Python Flask Tutorial',
                    'url': 'https://www.youtube.com/watch?v=Z1RJmh_OqeA',
                    'thumbnail': 'https://i.ytimg.com/vi/Z1RJmh_OqeA/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn Flask in this full course.',
                    'skill': 'flask'
                }
            ],
            'spring': [
                {
                    'video_id': 'If1Lw4pL0d4',
                    'title': 'Spring Boot Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=If1Lw4pL0d4',
                    'thumbnail': 'https://i.ytimg.com/vi/If1Lw4pL0d4/hqdefault.jpg',
                    'channel': 'Telusko',
                    'description': 'Learn Spring Boot in this full course.',
                    'skill': 'spring'
                }
            ],
            'react': [
                {
                    'video_id': 'bMknfKXIFA8',
                    'title': 'React Course - Beginner\'s Tutorial for React JavaScript Library',
                    'url': 'https://www.youtube.com/watch?v=bMknfKXIFA8',
                    'thumbnail': 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn React by building eight real-world projects and solving 140+ coding challenges.',
                    'skill': 'react'
                },
                {
                    'video_id': 'Ke90Tje7VS0',
                    'title': 'React JS - React Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
                    'thumbnail': 'https://i.ytimg.com/vi/Ke90Tje7VS0/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'React tutorial for beginners. Learn React basics in 30 minutes.',
                    'skill': 'react'
                },
                {
                    'video_id': 'w7ejDZ8SWv8',
                    'title': 'React JS Full Course 2023 | Build an App and Master React in 1 Hour',
                    'url': 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
                    'thumbnail': 'https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
                    'channel': 'JavaScript Mastery',
                    'description': 'Master React in one hour. Build a fully functional app using React.',
                    'skill': 'react'
                }
            ],
            'node.js': [
                {
                    'video_id': 'Oe421EPjeBE',
                    'title': 'Node.js Tutorial for Beginners: Learn Node in 1 Hour',
                    'url': 'https://www.youtube.com/watch?v=Oe421EPjeBE',
                    'thumbnail': 'https://i.ytimg.com/vi/Oe421EPjeBE/hqdefault.jpg',
                    'channel': 'Programming with Mosh',
                    'description': 'Node.js tutorial for beginners. Learn Node in one hour.',
                    'skill': 'node.js'
                },
                {
                    'video_id': 'fBNz5xF-Kx4',
                    'title': 'Node.js / Express Course - Build 4 Projects',
                    'url': 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
                    'thumbnail': 'https://i.ytimg.com/vi/fBNz5xF-Kx4/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn Node.js by building four projects.',
                    'skill': 'node.js'
                },
                {
                    'video_id': 'TlB_eWDSMt4',
                    'title': 'Node.js Full Course for Beginners | Complete All-in-One Tutorial',
                    'url': 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
                    'thumbnail': 'https://i.ytimg.com/vi/TlB_eWDSMt4/hqdefault.jpg',
                    'channel': 'Dave Gray',
                    'description': 'Node.js full course for beginners. Complete all-in-one tutorial.',
                    'skill': 'node.js'
                }
            ],
            'django': [
                {
                    'video_id': 'rHux0gMZ3Eg',
                    'title': 'Python Django Web Framework - Full Course for Beginners',
                    'url': 'https://www.youtube.com/watch?v=rHux0gMZ3Eg',
                    'thumbnail': 'https://i.ytimg.com/vi/rHux0gMZ3Eg/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'Learn Django in this full course for beginners.',
                    'skill': 'django'
                },
                {
                    'video_id': 'F5mRW0jo-U4',
                    'title': 'Django For Everybody - Full Python University Course',
                    'url': 'https://www.youtube.com/watch?v=F5mRW0jo-U4',
                    'thumbnail': 'https://i.ytimg.com/vi/F5mRW0jo-U4/hqdefault.jpg',
                    'channel': 'freeCodeCamp.org',
                    'description': 'This Django tutorial is taught by the instructor Charles Severence from the University of Michigan.',
                    'skill': 'django'
                },
                {
                    'video_id': '_ph8GF84fX4',
                    'title': 'Django Tutorial for Beginners',
                    'url': 'https://www.youtube.com/watch?v=_ph8GF84fX4',
                    'thumbnail': 'https://i.ytimg.com/vi/_ph8GF84fX4/hqdefault.jpg',
                    'channel': 'Tech With Tim',
                    'description': 'Django tutorial for beginners. Learn how to build websites with Django.',
                    'skill': 'django'
                }
            ]
        }
        
        recommendations = {}
        for skill in skills[:max_skills]:
            skill_lower = skill.lower()
            
            # Try exact match first
            if skill_lower in fallback_videos:
                recommendations[skill] = fallback_videos[skill_lower]
                print(f"  ✅ Added {len(fallback_videos[skill_lower])} fallback videos for {skill}")
            # Try partial match
            else:
                matched = False
                for key in fallback_videos.keys():
                    if key in skill_lower or skill_lower in key:
                        recommendations[skill] = fallback_videos[key]
                        print(f"  ✅ Added {len(fallback_videos[key])} fallback videos for {skill} (matched with {key})")
                        matched = True
                        break
                
                if not matched:
                    # No generic fallback - only specific videos allowed
                    print(f"  ℹ️  No specific fallback videos found for {skill}")
        
        return recommendations
    
    def get_skill_recommendations(self, skills, max_skills=10):
        """Get YouTube recommendations for skills with no duplicates"""
        if not skills or not self.api_key:
            print(f"⚠️ YouTube API - Skills: {skills}, API Key exists: {bool(self.api_key)}")
            return {}
        
        print(f"🎥 Fetching YouTube recommendations for {len(skills)} skills...")
        
        try:
            from googleapiclient.discovery import build
            from googleapiclient.errors import HttpError
            youtube = build('youtube', 'v3', developerKey=self.api_key)
            
            recommendations = {}
            self.seen_video_ids.clear()  # Reset for each new request
            
            # Limit to specified number of skills
            for skill in skills[:max_skills]:
                print(f"\n🔍 Searching videos for skill: {skill}")
                try:
                    search_response = youtube.search().list(
                        q=f"learn {skill} tutorial programming",
                        part='snippet',
                        type='video',
                        maxResults=10,  # Fetch more to filter duplicates
                        order='relevance',  # Use relevance for better skill matching
                        relevanceLanguage='en'
                    ).execute()
                    
                    print(f"  ✅ Found {len(search_response.get('items', []))} results for {skill}")
                    
                    videos = []
                    for search_result in search_response.get('items', []):
                        video_id = search_result['id']['videoId']
                        
                        # Skip if we've already seen this video
                        if video_id in self.seen_video_ids:
                            continue
                        
                        # Mark as seen
                        self.seen_video_ids.add(video_id)
                        
                        # Get the best available thumbnail
                        thumbnails = search_result['snippet']['thumbnails']
                        thumbnail_url = (
                            thumbnails.get('high', {}).get('url') or
                            thumbnails.get('medium', {}).get('url') or
                            thumbnails.get('default', {}).get('url')
                        )
                        
                        video = {
                            'video_id': video_id,
                            'title': search_result['snippet']['title'],
                            'url': f"https://www.youtube.com/watch?v={video_id}",
                            'thumbnail': thumbnail_url,
                            'channel': search_result['snippet']['channelTitle'],
                            'description': search_result['snippet']['description'][:200],  # Limit description
                            'skill': skill  # Tag video with the skill it's for
                        }
                        videos.append(video)
                        
                        # Stop when we have 3 unique videos for this skill
                        if len(videos) >= 3:
                            break
                    
                    # Only add if we found videos for this skill
                    if videos:
                        recommendations[skill] = videos
                        print(f"  ✅ Added {len(videos)} videos for {skill}")
                    else:
                        print(f"  ⚠️ No unique videos found for {skill}")
                        
                except HttpError as e:
                    if 'quotaExceeded' in str(e):
                        print(f"❌ YouTube API quota exceeded for skill: {skill}")
                        self.quota_exceeded = True
                        # Use fallback recommendations for remaining skills
                        print("🔄 Switching to fallback recommendations...")
                        fallback = self._get_fallback_recommendations(skills, max_skills)
                        recommendations.update(fallback)
                        break  # Exit the loop and use fallback for all
                    else:
                        print(f"❌ HTTP Error for {skill}: {e}")
                        # Re-raise other HTTP errors
                        raise e
                except Exception as e:
                    print(f"❌ Error fetching YouTube recommendations for skill {skill}: {e}")
                    recommendations[skill] = []
            
            print(f"\n🎯 Final: Fetched videos for {len(recommendations)} skills")
            return recommendations
        except HttpError as e:
            # Handle quota exceeded at top level
            if 'quotaExceeded' in str(e):
                print("❌ YouTube API quota exceeded")
                print("🔄 Using fallback recommendations...")
                return self._get_fallback_recommendations(skills, max_skills)
            else:
                print(f"❌ HTTP Error: {e}")
                import traceback
                traceback.print_exc()
                return self._get_fallback_recommendations(skills, max_skills)
        except Exception as e:
            print(f"❌ Error fetching YouTube recommendations: {e}")
            import traceback
            traceback.print_exc()
            # Use fallback instead of returning empty dict
            return self._get_fallback_recommendations(skills, max_skills)

class ResumeAnalyzer:
    def __init__(self, youtube_api_key=None):
        self.preprocessor = TextPreprocessor()
        self.skill_extractor = SkillExtractor()
        self.embedding_analyzer = EmbeddingAnalyzer()
        self.youtube_engine = YouTubeRecommendationEngine(youtube_api_key) if youtube_api_key else None
    
    def _find_missing_skills(self, resume_skills, job_skills):
        """Find missing skills in resume compared to job description"""
        return list(set(job_skills) - set(resume_skills))
    
    def _calculate_skill_match_score(self, resume_skills, job_skills):
        """Calculate skill match score as percentage with improved error handling"""
        try:
            # Handle edge cases
            if job_skills is None:
                job_skills = []
            if resume_skills is None:
                resume_skills = []
                
            # Convert to sets to ensure uniqueness
            job_skills_set = set(job_skills)
            resume_skills_set = set(resume_skills)
            
            # Handle case where there are no job skills
            if len(job_skills_set) == 0:
                return 100.0
            
            # Calculate intersection
            intersection = resume_skills_set & job_skills_set
            
            # Calculate percentage
            score = (len(intersection) / len(job_skills_set)) * 100
            
            # Ensure score is within valid range
            score = max(0.0, min(100.0, score))
            
            return score
        except Exception as e:
            print(f"Error calculating skill match score: {e}")
            return 0.0
    
    def _calculate_overall_score(self, semantic_similarity, skill_match_score, missing_skills):
        """Calculate overall match score with improved error handling"""
        try:
            # Handle None or NaN values
            if semantic_similarity is None or semantic_similarity != semantic_similarity:  # Check for NaN
                semantic_similarity = 0.0
            if skill_match_score is None or skill_match_score != skill_match_score:  # Check for NaN
                skill_match_score = 0.0
                
            # Ensure values are within valid range
            semantic_similarity = max(0.0, min(100.0, float(semantic_similarity)))
            skill_match_score = max(0.0, min(100.0, float(skill_match_score)))
            
            # Weighted combination: 40% semantic similarity, 50% skill match, 10% missing skills penalty
            missing_penalty = min(len(missing_skills) * 2, 20)  # Max 20 point penalty
            
            overall_score = (semantic_similarity * 0.4) + (skill_match_score * 0.5) - missing_penalty
            
            # Ensure score is within 0-100 range
            overall_score = max(0.0, min(100.0, overall_score))
            
            return overall_score
        except Exception as e:
            print(f"Error calculating overall score: {e}")
            return 0.0
    
    def _generate_ai_suggestions(self, resume_text, resume_skills, job_skills, missing_skills):
        """Generate AI suggestions for resume improvement"""
        suggestions = []
        
        # Suggestion based on missing skills
        if missing_skills:
            suggestions.append(f"Add these key skills to your resume: {', '.join(missing_skills[:5])}")
        
        # Suggestion based on resume length
        if len(resume_text.split()) < 300:
            suggestions.append("Your resume seems quite brief. Consider adding more details about your experiences and achievements.")
        
        # Suggestion to add metrics
        if "increased" not in resume_text.lower() and "reduced" not in resume_text.lower() and "improved" not in resume_text.lower():
            suggestions.append("Include quantifiable achievements with metrics (e.g., 'increased sales by 25%', 'reduced processing time by 40%').")
        
        # Suggestion to replace weak verbs
        weak_verbs = ['helped', 'assisted', 'worked on', 'involved in']
        for verb in weak_verbs:
            if verb in resume_text.lower():
                suggestions.append(f"Replace '{verb}' with stronger action verbs like 'led', 'managed', 'developed', 'implemented'.")
                break
        
        return suggestions
    
    def perform_comprehensive_analysis(self, resume_text, job_description_text):
        """Perform comprehensive analysis of resume and job description"""
        # Extract and preprocess texts
        processed_resume = self.preprocessor.preprocess_text(resume_text)
        processed_jd = self.preprocessor.preprocess_text(job_description_text)
        
        # Extract skills
        resume_tech_skills, resume_soft_skills, resume_all_skills = self.skill_extractor.extract_skills_from_text(resume_text)
        job_skills, job_skill_priorities, job_skills_sorted = self.skill_extractor.extract_skills_from_job_description(job_description_text)
        
        # Find missing skills
        missing_skills = self._find_missing_skills(resume_all_skills, job_skills)
        
        # Calculate semantic similarity
        semantic_similarity = self.embedding_analyzer.calculate_semantic_similarity(processed_resume, processed_jd)
        
        # Calculate skill match score
        skill_match_score = self._calculate_skill_match_score(resume_all_skills, job_skills)
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(semantic_similarity, skill_match_score, missing_skills)
        
        # Generate AI suggestions
        suggestions = self._generate_ai_suggestions(resume_text, resume_all_skills, job_skills, missing_skills)
        
        # Get YouTube recommendations
        youtube_recommendations = {}
        if self.youtube_engine:
            youtube_recommendations = self.youtube_engine.get_skill_recommendations(missing_skills)
        
        # Create keyword frequency maps
        def _to_freq_map(skills_list, priorities=None):
            if priorities:
                return priorities
            return dict(Counter(skills_list))
        
        resume_keyword_freq = _to_freq_map(resume_all_skills)
        jd_keyword_freq = _to_freq_map(job_skills, job_skill_priorities)
        
        # Return comprehensive results
        return {
            'semantic_similarity': semantic_similarity,
            'skill_match_score': skill_match_score,
            'overall_score': overall_score,
            'resume_skills': resume_all_skills,
            'job_skills': job_skills,
            'missing_skills': missing_skills,
            'resume_keyword_freq': resume_keyword_freq,
            'jd_keyword_freq': jd_keyword_freq,
            'suggestions': suggestions,
            'youtube_recommendations': youtube_recommendations
        }