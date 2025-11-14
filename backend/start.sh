#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Starting Gunicorn server..."
echo "Port: ${PORT}"
echo "Binding to: 0.0.0.0:${PORT}"

exec gunicorn profilematch.wsgi:application \
    --bind 0.0.0.0:${PORT} \
    --workers 2 \
    --threads 4 \
    --worker-class sync \
    --worker-tmp-dir /dev/shm \
    --timeout 120 \
    --keep-alive 5 \
    --log-level info \
    --access-logfile - \
    --error-logfile - \
    --log-file -
