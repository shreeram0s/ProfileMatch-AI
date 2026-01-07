#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn server..."
echo "Port: ${PORT}"
echo "Memory-optimized configuration for free tier"

exec gunicorn profilematch.wsgi:application \
    --bind 0.0.0.0:${PORT} \
    --workers 1 \
    --threads 1 \
    --worker-class sync \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --timeout 300 \
    --graceful-timeout 30 \
    --keep-alive 2 \
    --log-level info \
    --access-logfile - \
    --error-logfile - \
    --preload
