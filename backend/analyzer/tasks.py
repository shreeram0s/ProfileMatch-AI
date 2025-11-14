from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import time
import json


@shared_task(bind=True)
def analyze_resume_async(self, session_id, resume_path, jd_path):
    """
    Asynchronous task to analyze resume against job description
    with real-time WebSocket updates
    """
    channel_layer = get_channel_layer()
    
    try:
        # Import here to avoid circular imports
        from .ml_analysis import TextExtractor, ResumeAnalyzer
        from .views import extract_skills, calculate_similarity
        
        # Stage 1: Text Extraction
        async_to_sync(channel_layer.group_send)(
            f'analysis_{session_id}',
            {
                'type': 'analysis_update',
                'stage': 'extraction',
                'progress': 10,
                'message': 'Extracting text from documents...'
            }
        )
        time.sleep(0.5)  # Simulate processing time
        
        resume_text = TextExtractor.extract_text_from_file(resume_path)
        jd_text = TextExtractor.extract_text_from_file(jd_path)
        
        # Stage 2: Skill Extraction
        async_to_sync(channel_layer.group_send)(
            f'analysis_{session_id}',
            {
                'type': 'analysis_update',
                'stage': 'skills',
                'progress': 30,
                'message': 'Extracting skills from resume and job description...'
            }
        )
        time.sleep(0.5)
        
        resume_skills = extract_skills(resume_text)
        jd_skills = extract_skills(jd_text)
        
        # Stage 3: Analysis
        async_to_sync(channel_layer.group_send)(
            f'analysis_{session_id}',
            {
                'type': 'analysis_update',
                'stage': 'analysis',
                'progress': 50,
                'message': 'Analyzing resume compatibility...'
            }
        )
        time.sleep(1)
        
        analyzer = ResumeAnalyzer()
        analysis_result = analyzer.analyze(resume_text, jd_text)
        
        # Stage 4: Similarity Calculation
        async_to_sync(channel_layer.group_send)(
            f'analysis_{session_id}',
            {
                'type': 'analysis_update',
                'stage': 'similarity',
                'progress': 70,
                'message': 'Calculating match score...'
            }
        )
        time.sleep(0.5)
        
        similarity_score = calculate_similarity(resume_text, jd_text)
        
        # Stage 5: Final Processing
        async_to_sync(channel_layer.group_send)(
            f'analysis_{session_id}',
            {
                'type': 'analysis_update',
                'stage': 'finalizing',
                'progress': 90,
                'message': 'Finalizing results...'
            }
        )
        time.sleep(0.5)
        
        # Prepare results
        results = {
            'match_score': similarity_score,
            'resume_skills': resume_skills,
            'job_skills': jd_skills,
            'missing_skills': list(set(jd_skills) - set(resume_skills)),
            'common_skills': list(set(resume_skills) & set(jd_skills)),
            'resume_text': resume_text,
            'jd_text': jd_text,
            **analysis_result
        }
        
        # Send completion
        async_to_sync(channel_layer.group_send)(
            f'analysis_{session_id}',
            {
                'type': 'analysis_complete',
                'message': 'Analysis completed successfully!',
                'results': results
            }
        )
        
        return results
        
    except Exception as e:
        # Send error
        async_to_sync(channel_layer.group_send)(
            f'analysis_{session_id}',
            {
                'type': 'analysis_error',
                'message': 'An error occurred during analysis',
                'error': str(e)
            }
        )
        raise


@shared_task
def fetch_jobs_async(skills, location='India'):
    """
    Asynchronous task to fetch jobs from Adzuna API
    """
    from .views import fetch_jobs_from_adzuna
    return fetch_jobs_from_adzuna(skills)


@shared_task
def generate_interview_kit_async(job_title, skills):
    """
    Asynchronous task to generate interview preparation kit
    """
    # Import here to avoid circular imports
    from .views import get_youtube_videos
    
    interview_questions = [
        f"Tell me about your experience with {skills[0] if skills else 'your field'}",
        f"How would you approach a project involving {skills[1] if len(skills) > 1 else 'new technologies'}?",
        "Describe a challenging problem you solved recently",
        "How do you stay updated with industry trends?",
        "What are your salary expectations?"
    ]
    
    # Get learning resources
    videos = []
    for skill in skills[:5]:  # Limit to 5 skills
        skill_videos = get_youtube_videos(skill)
        videos.extend(skill_videos[:2])  # 2 videos per skill
    
    return {
        'questions': interview_questions,
        'learning_resources': videos,
        'tips': [
            'Research the company thoroughly',
            'Prepare STAR method examples',
            'Practice coding challenges if technical role',
            'Prepare questions to ask the interviewer',
            'Review your resume and be ready to discuss all points'
        ]
    }
