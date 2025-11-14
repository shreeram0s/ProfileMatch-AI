FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download NLP models during build
RUN python -m spacy download en_core_web_sm
RUN python -c "import nltk; nltk.download('wordnet'); nltk.download('omw-1.4'); nltk.download('punkt'); nltk.download('stopwords')"

# Copy application code
COPY . .

# Copy and set permissions for startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Collect static files (ignore errors if SECRET_KEY not set yet)
RUN python manage.py collectstatic --noinput --clear || true

# Create media directory
RUN mkdir -p media/resumes

# Start server
CMD ["/start.sh"]