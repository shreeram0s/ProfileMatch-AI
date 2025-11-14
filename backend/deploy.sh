#!/bin/bash

echo "🚀 Starting Production Deployment Script..."

# Run migrations
echo "📦 Running database migrations..."
python manage.py migrate --noinput

# Download NLTK data
echo "📚 Downloading NLTK data..."
python -c "import nltk; nltk.download('wordnet', quiet=True); nltk.download('omw-1.4', quiet=True)"

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create media directories if they don't exist
echo "📂 Creating media directories..."
mkdir -p media/resumes

echo "✅ Deployment preparation complete!"
