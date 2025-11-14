#!/bin/bash
# Build script for Render

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm

echo "Downloading NLTK data..."
python -c "import nltk; nltk.download('wordnet', quiet=True); nltk.download('omw-1.4', quiet=True); nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True)"

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Creating media directories..."
mkdir -p media/resumes

echo "Build complete!"
