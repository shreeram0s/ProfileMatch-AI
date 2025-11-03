#!/usr/bin/env python
"""
Production initialization script for ProFileMatch
This script initializes the database and downloads required NLTK data
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the project directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'profilematch.settings')
django.setup()

def init_production():
    """Initialize production environment"""
    try:
        # Import Django management commands
        from django.core.management import execute_from_command_line
        import nltk
        
        print("Initializing ProFileMatch production environment...")
        
        # Run migrations
        print("Running database migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        # Download required NLTK data
        print("Downloading NLTK data...")
        nltk.download('punkt')
        nltk.download('stopwords')
        nltk.download('wordnet')
        nltk.download('omw-1.4')
        
        print("Production initialization completed successfully!")
        
    except Exception as e:
        print(f"Error during initialization: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_production()