import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../apiClient';
import { 
  Users, 
  Code, 
  MessageCircle, 
  Lightbulb, 
  FileText, 
  ArrowRight,
  Loader2,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  Briefcase,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InterviewPrepPage = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('technical');

  // Get missing skills from localStorage
  useEffect(() => {
    const storedMissingSkills = localStorage.getItem('missingSkills');
    const lastAnalysis = localStorage.getItem('lastAnalysis');
    
    if (storedMissingSkills) {
      try {
        const parsedSkills = JSON.parse(storedMissingSkills);
        setMissingSkills(parsedSkills);
      } catch (e) {
        console.error('Error parsing missing skills:', e);
      }
    } else if (lastAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(lastAnalysis);
        if (parsedAnalysis.missing_skills) {
          setMissingSkills(parsedAnalysis.missing_skills);
        }
      } catch (e) {
        console.error('Error parsing last analysis:', e);
      }
    }
  }, []);

  // Fetch interview preparation data
  useEffect(() => {
    if (missingSkills.length > 0) {
      fetchInterviewPrep();
    }
  }, [missingSkills]);

  const fetchInterviewPrep = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/interview-kit/', {
        skills: missingSkills
      });
      
      setInterviewData(response.data);
    } catch (err) {
      setError('Error fetching interview preparation materials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Interview <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Preparation</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Personalized interview questions and preparation materials based on your skill gaps
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 bg-muted/50 rounded-3xl my-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Skills to Prepare For
            </h2>
            <p className="text-muted-foreground">
              Based on your analysis, here are the skills you should focus on for interviews
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {missingSkills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-medium"
              >
                {skill}
              </motion.span>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={fetchInterviewPrep}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Zap className="h-4 w-4 animate-spin" />
                  Generating Materials...
                </>
              ) : (
                  <>
                    <Code className="h-4 w-4" />
                    Refresh Interview Kit
                  </>
                )}
              </button>
          </div>
        </div>
      </section>

      {/* Interview Preparation Content */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center mb-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchInterviewPrep}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Zap className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : interviewData ? (
            <>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'technical'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Code className="h-4 w-4" />
                  Technical Questions
                </button>
                <button
                  onClick={() => setActiveTab('behavioral')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'behavioral'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Behavioral Questions
                </button>
                <button
                  onClick={() => setActiveTab('situational')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'situational'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Situational Questions
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'resources'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Lightbulb className="h-4 w-4" />
                  Learning Resources
                </button>
              </div>

              {/* Technical Questions */}
              {activeTab === 'technical' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Code className="h-8 w-8 text-primary" />
                    Technical Questions
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {interviewData.technical_questions && interviewData.technical_questions.length > 0 ? (
                      interviewData.technical_questions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-background border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1 text-primary">
                              <Code className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">
                                {question.skill} Question #{index + 1}
                              </h3>
                              <p className="text-muted-foreground mb-3">{question.question}</p>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs">
                                  {question.difficulty}
                                </span>
                                <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs">
                                  {question.skill}
                                </span>
                              </div>
                              
                              {/* Answers Section */}
                              {question.answers && question.answers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-muted">
                                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Sample Answers:</h4>
                                  <div className="space-y-3">
                                    {question.answers.map((answer, answerIndex) => (
                                      <div key={answerIndex} className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-sm">{answer}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Technical Questions Available</h3>
                        <p className="text-muted-foreground">
                          Try refreshing the interview kit or completing a new analysis.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Behavioral Questions */}
              {activeTab === 'behavioral' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    Behavioral Questions
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {interviewData.behavioral_questions && interviewData.behavioral_questions.length > 0 ? (
                      interviewData.behavioral_questions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-background border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1 text-primary">
                              <Users className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">
                                {question.skill} Question #{index + 1}
                              </h3>
                              <p className="text-muted-foreground mb-3">{question.question}</p>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs">
                                  {question.difficulty}
                                </span>
                                <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs">
                                  {question.skill}
                                </span>
                              </div>
                              
                              {/* Answers Section */}
                              {question.answers && question.answers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-muted">
                                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Sample Answers:</h4>
                                  <div className="space-y-3">
                                    {question.answers.map((answer, answerIndex) => (
                                      <div key={answerIndex} className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-sm">{answer}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Behavioral Questions Available</h3>
                        <p className="text-muted-foreground">
                          Try refreshing the interview kit or completing a new analysis.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Situational Questions */}
              {activeTab === 'situational' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <MessageCircle className="h-8 w-8 text-primary" />
                    Situational Questions
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {interviewData.situational_questions && interviewData.situational_questions.length > 0 ? (
                      interviewData.situational_questions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-background border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1 text-primary">
                              <MessageCircle className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">
                                {question.skill} Question #{index + 1}
                              </h3>
                              <p className="text-muted-foreground mb-3">{question.question}</p>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs">
                                  {question.difficulty}
                                </span>
                                <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs">
                                  {question.skill}
                                </span>
                              </div>
                              
                              {/* Answers Section */}
                              {question.answers && question.answers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-muted">
                                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Sample Answers:</h4>
                                  <div className="space-y-3">
                                    {question.answers.map((answer, answerIndex) => (
                                      <div key={answerIndex} className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-sm">{answer}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Situational Questions Available</h3>
                        <p className="text-muted-foreground">
                          Try refreshing the interview kit or completing a new analysis.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Learning Resources */}
              {activeTab === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <Lightbulb className="h-8 w-8 text-primary" />
                    Learning Resources
                  </h2>
                  
                  {interviewData.youtube_recommendations && Object.keys(interviewData.youtube_recommendations).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(interviewData.youtube_recommendations).map(([skill, videos], skillIndex) => (
                        <motion.div
                          key={skillIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: skillIndex * 0.1 }}
                          className="bg-background border rounded-2xl p-6"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Lightbulb className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">{skill}</h3>
                          </div>
                          
                          <div className="space-y-4">
                            {videos.map((video, videoIndex) => (
                              <a
                                key={videoIndex}
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                              >
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-24 h-16 object-cover rounded"
                                />
                                <div className="flex-grow">
                                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                    {video.title}
                                  </h4>
                                </div>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Learning Resources Available</h3>
                      <p className="text-muted-foreground">
                        Try refreshing the interview kit or completing a new analysis.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Interview Data Available</h3>
              <p className="text-muted-foreground mb-6">
                Complete an analysis to receive personalized interview preparation materials.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Analyze Your Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Export CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Export Your Interview Preparation</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Save your personalized interview questions and preparation materials as a PDF
          </p>
          <Link 
            to="/export" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            <FileText className="h-5 w-5" />
            Export as PDF
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InterviewPrepPage;