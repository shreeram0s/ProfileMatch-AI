# ProFileMatch Deployment Checklist

## Pre-deployment Checklist

### Backend
- [ ] Update `settings.py` with production values
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Set strong `SECRET_KEY`
- [ ] Configure database connection
- [ ] Remove any development-specific settings
- [ ] Ensure all environment variables are properly configured
- [ ] Run `python manage.py collectstatic` if serving static files
- [ ] Test database migrations

### Frontend
- [ ] Update API endpoints to point to production backend
- [ ] Build production version with `npm run build`
- [ ] Verify all environment variables are set
- [ ] Test build locally before deployment

### Security
- [ ] Rotate all API keys and secrets
- [ ] Ensure HTTPS is configured
- [ ] Set proper CORS headers
- [ ] Review and update permissions

## Deployment Steps

### Render Deployment

1. **Backend Service**
   - [ ] Create new Web Service
   - [ ] Connect to GitHub repository
   - [ ] Set build command: `pip install -r requirements.txt`
   - [ ] Set start command: `python manage.py migrate && gunicorn profilematch.wsgi:application`
   - [ ] Configure environment variables:
     - `SECRET_KEY`
     - `DEBUG` = False
     - `ALLOWED_HOSTS`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_HOST`
     - `DB_PORT`
     - `YOUTUBE_API_KEY`
     - `ADZUNA_APP_ID`
     - `ADZUNA_APP_KEY`
   - [ ] Deploy service

2. **Frontend Service**
   - [ ] Create new Static Site
   - [ ] Connect to same GitHub repository
   - [ ] Set build command: `npm install && npm run build`
   - [ ] Set publish directory: `dist`
   - [ ] Configure environment variables if needed
   - [ ] Deploy service

3. **Database**
   - [ ] Create PostgreSQL database on Render
   - [ ] Configure database connection in backend service
   - [ ] Run initial migrations

## Post-deployment Verification

### Backend
- [ ] Verify health check endpoint: `/api/health/`
- [ ] Test file upload endpoint: `/api/upload/`
- [ ] Test analysis endpoint: `/api/analyze/`
- [ ] Test job recommendations: `/api/jobs/`
- [ ] Test interview preparation: `/api/interview-kit/`
- [ ] Test history endpoint: `/api/history/`
- [ ] Test comparison endpoint: `/api/compare/`

### Frontend
- [ ] Verify homepage loads correctly
- [ ] Test document upload functionality
- [ ] Verify analysis results display properly
- [ ] Test all navigation links
- [ ] Verify PDF export functionality
- [ ] Test job recommendations page
- [ ] Test interview preparation page
- [ ] Test history page
- [ ] Test comparison page

### Integration
- [ ] Verify frontend can communicate with backend
- [ ] Test YouTube API integration
- [ ] Test Adzuna API integration
- [ ] Verify database operations
- [ ] Test file upload and processing

## Monitoring and Maintenance

- [ ] Set up logging
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Schedule regular database backups
- [ ] Monitor API usage limits
- [ ] Plan for scaling if needed

## Troubleshooting

### Common Issues
1. **CORS errors**: Verify `CORS_ALLOWED_ORIGINS` settings
2. **Database connection**: Check database credentials and network access
3. **Static files not loading**: Ensure `STATIC_ROOT` and `STATIC_URL` are configured correctly
4. **API key errors**: Verify all API keys are valid and properly configured
5. **Memory issues**: Monitor resource usage and consider upgrading plan if needed

### Useful Commands
```bash
# Check backend health
curl https://your-backend-url/api/health/

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Check database connection
python manage.py dbshell

# View logs
# Check Render dashboard logs
```