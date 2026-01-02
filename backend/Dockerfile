FROM python:3.9-slim

ENV PYTHONUNBUFFERED=1

# Set production environment variables
ENV DEBUG=False
ENV CORS_ALLOW_ALL_ORIGINS=True
ENV ALLOWED_HOSTS=*
ENV SECRET_KEY=django-insecure-production-5z!#7z$3%3+5^2!+x%3!+x%3!+x%3!+x%3!+x%3!+x%3!+x%
ENV CSRF_TRUSTED_ORIGINS=http://localhost:5176,http://localhost:5177,https://*.onrender.com,https://profilematch-ai-frontend.onrender.com
ENV CORS_ALLOWED_ORIGINS=http://localhost:5176,http://localhost:5177,http://127.0.0.1:5176,https://*.onrender.com,https://profilematch-ai-frontend.onrender.com

# Database credentials (hardcoded for self-contained deployment)
ENV DB_NAME=magic2
ENV DB_USER=magic2_user
ENV DB_PASSWORD=UeMppumFYJRDjOFoYzdqszc0Pfo9K6R3
ENV DB_HOST=dpg-d43qarbe5dus73a89i0g-a.singapore-postgres.render.com
ENV DB_PORT=5432

# API Keys
ENV ADZUNA_APP_ID=962974fe
ENV ADZUNA_APP_KEY=cb18422dd62921861ad8d4b423942105
ENV YOUTUBE_API_KEY=AIzaSyCC8YoN1GeLvQXYbOei_ykpoQZELHyD6HY

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

# Install huggingface-hub for downloading model files
RUN pip install huggingface-hub

# Download SentenceTransformer model files to a specific directory
# This avoids loading the model into memory during build
ENV SENTENCE_TRANSFORMER_MODEL_PATH=/app/model/all-MiniLM-L6-v2
RUN python -c "from huggingface_hub import snapshot_download; \
    import os; \
    print('Downloading model files...'); \
    path = snapshot_download('sentence-transformers/all-MiniLM-L6-v2', \
                           local_dir=os.environ['SENTENCE_TRANSFORMER_MODEL_PATH'], \
                           local_dir_use_symlinks=False); \
    print(f'Model downloaded to {path}')"

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