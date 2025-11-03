# ProFileMatch - AI-Powered Resume Analysis Platform

ProFileMatch is an intelligent career development platform that helps job seekers optimize their resumes and advance their careers through AI-powered analysis and personalized recommendations.

## Features

- **Resume Analysis**: Upload your resume and job description for detailed skill matching
- **AI Insights**: Get actionable insights to optimize your career profile using machine learning algorithms
- **Skill Gap Identification**: Discover missing skills compared to job requirements
- **Match Scoring**: Receive comprehensive match percentages based on semantic similarity and skill overlap
- **Learning Resources**: Access personalized YouTube tutorials for missing skills
- **Job Recommendations**: Find job opportunities tailored to your skills
- **Interview Preparation**: Get personalized interview questions and study materials
- **PDF Export**: Save your analysis results as a professional PDF report

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion for animations
- Recharts for data visualization
- Lucide-react for icons

### Backend
- Django + Django REST Framework
- PostgreSQL database
- spaCy for NLP processing
- scikit-learn for similarity calculations
- YouTube Data API for learning resources
- Adzuna API for job recommendations

## Deployment

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL

### Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
SECRET_KEY=your_django_secret_key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,another-domain.com
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
YOUTUBE_API_KEY=your_youtube_api_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://another-frontend-domain.com
```

### Local Development Setup

1. **Backend Setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
npm run dev
```

### Deployment on Render

1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the following build and start commands:
   - Build: `pip install -r requirements.txt`
   - Start: `python manage.py migrate && gunicorn profilematch.wsgi:application`
5. Add the required environment variables in the Render dashboard
6. Deploy the application

For the frontend:
1. Create another Web Service on Render
2. Set the build command to: `npm install && npm run build`
3. Set the publish directory to: `dist`
4. Add environment variables as needed

## Project Structure
```
├── backend/
│   ├── analyzer/     # Core Django app with ML analysis
│   ├── profilematch/ # Project settings
│   └── manage.py
├── frontend/
│   ├── src/components/ # UI components
│   ├── src/pages/      # Page routes
│   └── vite.config.js
└── README.md
```

## API Endpoints

- `POST /api/upload/` - Upload resume and job description
- `POST /api/analyze/` - Analyze uploaded documents
- `GET /api/jobs/` - Get job recommendations
- `POST /api/interview-kit/` - Get interview preparation materials
- `GET /api/history/` - Get analysis history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or questions, please open an issue on this repository.