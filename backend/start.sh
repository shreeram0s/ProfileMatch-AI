#!/usr/bin/env bash
# Start script for Render

set -o errexit

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn server..."
exec gunicorn profilematch.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 1 \
    --threads 2 \
    --timeout 120 \
    --worker-class gthread \
    --log-level info \
    --access-logfile - \
    --error-logfile -
