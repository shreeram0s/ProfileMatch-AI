import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import { 
  FileUp, 
  FileText, 
  BarChart3, 
  Search, 
  Users, 
  ArrowRight,
  Upload,
  Brain,
  Target,
  BookOpen,
  Briefcase,
  Loader2,
  ScanFace,
  FileSearch,
  Lightbulb,
  Globe,
  Award
} from 'lucide-react';
import { api, apiForm } from '../apiClient';
import AnalysisResults from '../components/AnalysisResults';
import AnalysisAnimation from '../components/AnalysisAnimation';
import ParticleBackground from '../components/ParticleBackground';
import AnimatedCard from '../components/AnimatedCard';
import GlassPanel from '../components/GlassPanel';
import { useTheme } from '../components/theme-provider';

const workflowSteps = [
  {
    icon: <FileUp className="h-8 w-8" />,
    title: 'Upload Documents',
    description: 'Upload your resume and job description in PDF, DOCX, or TXT format.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: <ScanFace className="h-8 w-8" />,
    title: 'AI Analysis',
    description: 'Our AI extracts skills, computes match scores, and identifies gaps.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Visual Insights',
    description: 'View detailed analytics on your skills and areas for improvement.',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: 'Learn & Improve',
    description: 'Get personalized learning resources for missing skills.',
    color: 'from-pink-500 to-pink-600'
  }
];

const features = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: 'Resume Analysis',
    description: 'AI-powered analysis of your resume to extract skills and experiences using advanced NLP techniques.'
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Analytics Dashboard',
    description: 'Visualize your skills and identify areas for improvement with interactive charts and graphs.'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Learning Resources',
    description: 'Get personalized learning recommendations based on your skill gaps from YouTube tutorials.'
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'AI Insights',
    description: 'Receive actionable insights to optimize your career profile using machine learning algorithms.'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Job Recommendations',
    description: 'Discover job opportunities tailored to your skills using Adzuna API with location-based filtering.'
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Interview Prep',
    description: 'Get personalized interview questions and study materials for technical and behavioral interviews.'
  }
];

const Home = () => {
  const { theme } = useTheme();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [error, setError] = useState(null);
  const [resumeDragActive, setResumeDragActive] = useState(false);
  const [jdDragActive, setJdDragActive] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      toast.success(`Resume "${file.name}" uploaded successfully!`);
    }
  };

  const handleJDChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJobDescription(file);
      toast.success(`Job Description "${file.name}" uploaded successfully!`);
    }
  };

  // Drag and drop handlers
  const handleResumeDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleResumeDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setResumeDragActive(true);
  }, []);

  const handleResumeDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setResumeDragActive(false);
  }, []);

  const handleResumeDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setResumeDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setResume(file);
      toast.success(`Resume "${file.name}" uploaded successfully!`);
    }
  }, []);

  const handleJDDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleJDDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setJdDragActive(true);
  }, []);

  const handleJDDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setJdDragActive(false);
  }, []);

  const handleJDDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setJdDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setJobDescription(file);
      toast.success(`Job Description "${file.name}" uploaded successfully!`);
    }
  }, []);

  const handleAnalysisComplete = () => {
    setShowAnimation(false);
  };

  const handleAnalyze = async () => {
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }
    
    if (!jobDescription) {
      toast.error('Please upload the job description');
      return;
    }

    setLoading(true);
    setShowAnimation(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jd', jobDescription);

    try {
      // Upload files
      const uploadResponse = await apiForm.post('/api/upload/', formData);

      toast.success('Documents uploaded! Analyzing...');
      
      // Wait a moment to show the success message
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Analyze files
      const analyzeResponse = await api.post('/api/analyze/', {
        analysis_id: uploadResponse.data.analysis_id
      });

      setAnalysisData(analyzeResponse.data);
      
      // Store analysis results in localStorage for other pages
      localStorage.setItem('lastAnalysis', JSON.stringify(analyzeResponse.data));
      
      // Store missing skills in localStorage for interview prep
      if (analyzeResponse.data.missing_skills) {
        localStorage.setItem('missingSkills', JSON.stringify(analyzeResponse.data.missing_skills));
      }
      
      // Store resume skills in localStorage for job recommendations
      if (analyzeResponse.data.resume_skills) {
        localStorage.setItem('resumeSkills', JSON.stringify(analyzeResponse.data.resume_skills));
      }
      
      toast.success('Analysis completed successfully!');
    } catch (err) {
      console.error('Full error object:', err);
      
      let errorMessage = 'Error analyzing documents. Please try again.';
      
      if (err.response) {
        console.error('Error response:', err.response);
        if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        console.error('Error request:', err.request);
        errorMessage = 'Network error. Please check your connection and make sure the backend server is running.';
      } else {
        console.error('Error message:', err.message);
        errorMessage = err.message || errorMessage;
      }
      
      toast.error(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
      setShowAnimation(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground theme={theme} />
      
      {/* Analysis Animation Overlay */}
      <AnalysisAnimation 
        isLoading={showAnimation} 
        onComplete={handleAnalysisComplete} 
      />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-32 relative">
        <motion.div 
          ref={heroRef}
          style={{ opacity }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full text-sm font-medium mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Target className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-gradient">Smart Resume Analysis</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Optimize Your Career with{' '}
              <span className="text-gradient animate-gradient">AI Precision</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Upload your resume and job description for instant AI-powered insights and personalized recommendations
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Document Upload Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upload Your <span className="text-gradient">Documents</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Drag and drop or click to upload your resume and job description
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Upload */}
            <AnimatedCard delay={0.1} glassmorphism={true}>
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 shadow-lg"
                >
                  <FileText className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-muted-foreground text-sm">
                  PDF, DOCX, or TXT format
                </p>
              </div>
              
              <motion.div
                onDragEnter={handleResumeDragIn}
                onDragLeave={handleResumeDragOut}
                onDragOver={handleResumeDrag}
                onDrop={handleResumeDrop}
                whileHover={{ scale: 1.02 }}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
                  resumeDragActive 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : resume 
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-muted-foreground/30 hover:border-primary/50'
                }`}
              >
                {resumeDragActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-10"
                  >
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-primary font-semibold">Drop your resume here</p>
                    </div>
                  </motion.div>
                )}
                
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-3">
                    {resume ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FileSearch className="h-12 w-12 text-green-500" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {resume.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Click to change file
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-lg mb-1">
                            Drag & drop or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PDF, DOCX, or TXT (Max 10MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </motion.div>
            </AnimatedCard>
            
            {/* Job Description Upload */}
            <AnimatedCard delay={0.2} glassmorphism={true}>
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-4 shadow-lg"
                >
                  <FileSearch className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Upload Job Description</h3>
                <p className="text-muted-foreground text-sm">
                  PDF, DOCX, or TXT format
                </p>
              </div>
              
              <motion.div
                onDragEnter={handleJDDragIn}
                onDragLeave={handleJDDragOut}
                onDragOver={handleJDDrag}
                onDrop={handleJDDrop}
                whileHover={{ scale: 1.02 }}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
                  jdDragActive 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : jobDescription 
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-muted-foreground/30 hover:border-primary/50'
                }`}
              >
                {jdDragActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-10"
                  >
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-primary font-semibold">Drop job description here</p>
                    </div>
                  </motion.div>
                )}
                
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleJDChange}
                  className="hidden"
                  id="jd-upload"
                />
                <label htmlFor="jd-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center gap-3">
                    {jobDescription ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FileSearch className="h-12 w-12 text-green-500" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {jobDescription.name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Click to change file
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-lg mb-1">
                            Drag & drop or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PDF, DOCX, or TXT (Max 10MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </motion.div>
            </AnimatedCard>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <motion.button
              onClick={handleAnalyze}
              disabled={loading || !resume || !jobDescription}
              whileHover={!loading && resume && jobDescription ? { scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" } : {}}
              whileTap={!loading && resume && jobDescription ? { scale: 0.95 } : {}}
              className={`group relative px-12 py-5 rounded-full font-semibold text-lg shadow-2xl transition-all overflow-hidden ${
                loading || !resume || !jobDescription
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-3xl'
              }`}
            >
              {!loading && resume && jobDescription && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              )}
              <span className="relative flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6" />
                    Analyze with AI
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Analysis Results */}
      {analysisData && (
        <section className="container mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Analysis Results</h2>
              <p className="text-muted-foreground text-lg">
                Detailed insights from your resume analysis
              </p>
            </div>
            
            <AnalysisResults analysisData={analysisData} />
            
            {/* Next Steps */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-6">Continue Your Career Journey</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <BarChart3 className="h-5 w-5" />
                  View Dashboard
                </Link>
                <Link
                  to="/suggestions"
                  className="flex items-center gap-2 px-6 py-3 bg-background border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Lightbulb className="h-5 w-5" />
                  See Suggestions
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center gap-2 px-6 py-3 bg-background border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Briefcase className="h-5 w-5" />
                  Find Jobs
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Workflow Section */}
      <section className="container mx-auto px-4 sm:px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30 rounded-3xl -z-10" />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to optimize your career profile
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative"
              >
                <GlassPanel className="text-center h-full">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                      {step.icon}
                    </div>
                  </motion.div>
                  <div className="text-5xl font-bold text-primary/10 absolute top-4 right-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive <span className="text-gradient">Career Insights</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to understand and optimize your career profile
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard
                key={index}
                delay={index * 0.1}
                hover3d={true}
                glassmorphism={index % 2 === 0}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;