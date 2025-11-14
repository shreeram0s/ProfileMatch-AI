FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN echo "Installing Python packages..." && \
    pip install --no-cache-dir -r requirements.txt && \
    echo "Python packages installed successfully"

# Download models and data
RUN echo "Downloading spaCy model..." && \
    python -m spacy download en_core_web_sm && \
    echo "spaCy model downloaded" && \
    echo "Downloading NLTK data..." && \
    python -c "import nltk; nltk.download('wordnet'); nltk.download('omw-1.4'); nltk.download('punkt'); nltk.download('stopwords')" && \
    echo "NLTK data downloaded"

# Copy application
COPY . .

# Collect static files
RUN echo "Collecting static files..." && \
    python manage.py collectstatic --noinput || echo "Static collection skipped" && \
    echo "Static files ready"

# Create media directory
RUN mkdir -p media/resumes && echo "Media directory created"

# Expose port
EXPOSE 8000

# Start command
CMD ["sh", "-c", "echo 'Starting application...' && echo 'Running migrations...' && python manage.py migrate --noinput && echo 'Migrations complete' && echo 'Starting Gunicorn on port '$PORT'...' && exec gunicorn profilematch.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --timeout 120 --log-level debug --access-logfile - --error-logfile -"]