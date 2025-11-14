FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

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

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p media/resumes staticfiles

# Make deploy script executable
RUN chmod +x deploy.sh

# Expose port (Render will provide PORT env var at runtime)
EXPOSE $PORT

# Run deployment script and start server
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py collectstatic --noinput && mkdir -p media/resumes && gunicorn profilematch.wsgi:application --bind 0.0.0.0:$PORT --timeout 120 --workers 2 --threads 4 --worker-class gthread --access-logfile - --error-logfile -"]