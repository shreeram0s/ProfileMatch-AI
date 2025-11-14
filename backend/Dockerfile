FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Install spaCy model
RUN python -m spacy download en_core_web_sm

# Download NLTK data
RUN python -c "import nltk; nltk.download('wordnet', quiet=True); nltk.download('omw-1.4', quiet=True); nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True)"

# Copy application code
COPY . .

# Create necessary directories and collect static files
RUN mkdir -p media/resumes staticfiles && \
    python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD python manage.py migrate --noinput && \
    gunicorn profilematch.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --threads 2 \
    --timeout 120 \
    --worker-class gthread \
    --log-level info \
    --access-logfile - \
    --error-logfile -