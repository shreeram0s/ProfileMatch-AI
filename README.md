# ProFileMatch – AI Resume Analysis Platform 🚀

ProFileMatch is an **AI-powered Resume & Job Description (JD) analysis platform** that helps job seekers optimize their resumes using **intelligent insights, skill-gap detection, match scoring, job recommendations, and interview preparation**.

🌍 **Live on Render**
- **Frontend:** https://projektafrontend.onrender.com  
- **Backend API:** https://projektabackend.onrender.com  
- **Health Check:** https://projektabackend.onrender.com/api/health/

---

## 🎯 Key Features

- **Resume & JD Analysis** – Upload resume and job descriptions for intelligent matching  
- **AI-Driven Insights** – Personalized career optimization suggestions  
- **Skill Gap Analysis** – Identify missing skills and improvement areas  
- **Match Scoring** – Semantic similarity-based matching algorithm  
- **Learning Resources** – Personalized YouTube course recommendations  
- **Job Recommendations** – Real-time job suggestions via Adzuna API  
- **Interview Prep** – AI-generated interview questions and tips  
- **PDF Export** – Download analysis results as professional reports  

---

## 🛠️ Tech Stack

### Backend
- Django 4.2.7 + Django REST Framework  
- PostgreSQL Database  
- spaCy (NLP Processing)  
- scikit-learn (ML Similarity)  
- Gunicorn (Production Server)  
- WhiteNoise (Static Files)  

### Frontend
- React 18 + Vite  
- Tailwind CSS + shadcn/ui  
- Framer Motion (Animations)  
- Recharts (Visualizations)  
- Material-UI Components  
- Axios (API Client)  

### DevOps / Deployment
- Docker + Docker Compose  
- nginx (Web Server)  
- Render (Cloud Platform)  

---

## 📁 Project Structure

```bash
ProFileMatch/
├── backend/              # Django REST API Backend
│   ├── analyzer/         # Core analysis app
│   ├── profilematch/     # Django project settings
│   ├── Dockerfile        # Backend Docker configuration
│   ├── deploy.sh         # Deployment automation script
│   └── requirements.txt  # Python dependencies
│
├── frontend/             # React + Vite Frontend
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Application pages
│   │   └── apiClient.js  # API communication layer
│   ├── Dockerfile        # Frontend Docker configuration
│   ├── nginx.conf        # Production nginx config
│   └── package.json      # Node dependencies
│
├── docker-compose.yml    # Multi-container orchestration
├── .env.production       # Environment variables template
└── README.md             # Documentation
🚀 Quick Start
Using Docker Compose (Recommended)
1) Clone and setup
git clone <your-repo-url>
cd ProFileMatch
cp .env.production .env
# Edit .env with your configuration

2) Run with Docker
docker-compose up --build

3) Access the application

Frontend: http://localhost:80

Backend API: http://localhost:8000

Health Check: http://localhost:8000/api/health/

⚙️ Manual Setup
Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

python manage.py migrate
python manage.py runserver


Backend will run at:

http://localhost:8000

Frontend Setup
cd frontend
npm install
npm run dev


Frontend will run at:

http://localhost:5173

🌐 Deployment on Render
Backend Service (Render Web Service)

Create a Web Service on Render

Configure:

Name: profilematch-backend

Root Directory: backend

Environment: Docker

Region: Singapore (or nearest)

Add environment variables (see below)

Deploy

Live Backend:

https://projektabackend.onrender.com

Frontend Service (Render Static Site)

Create a Static Site on Render

Configure:

Name: profilematch-frontend

Root Directory: frontend

Build Command: npm install && npm run build

Publish Directory: dist

Add environment variable:

VITE_API_URL=https://projektabackend.onrender.com


Deploy

Live Frontend:

https://projektafrontend.onrender.com

🔧 Environment Variables
Backend
SECRET_KEY=your-django-secret-key
DEBUG=False
ALLOWED_HOSTS=projektabackend.onrender.com
CORS_ALLOWED_ORIGINS=https://projektafrontend.onrender.com

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432

YOUTUBE_API_KEY=your_api_key
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key

Frontend
VITE_API_URL=https://projektabackend.onrender.com

📡 API Endpoints

POST /api/upload/ – Upload resume and JD

POST /api/analyze/ – Analyze resume and generate match score

GET /api/jobs/ – Get job recommendations

POST /api/interview-kit/ – Generate interview preparation kit

GET /api/history/ – Get analysis history

POST /api/compare/ – Compare resumes

GET /api/health/ – Health check

🔒 Security

Environment variables for sensitive data

CORS restricted to specific origins

HTTPS enforced in production

SQL injection protection

XSS protection enabled

CSRF tokens implemented

📝 License

MIT License - See LICENSE file for details

🤝 Contributing

Fork the repository

Create feature branch:

git checkout -b feature/AmazingFeature


Commit changes:

git commit -m "Add AmazingFeature"


Push to branch:

git push origin feature/AmazingFeature


Open a Pull Request
