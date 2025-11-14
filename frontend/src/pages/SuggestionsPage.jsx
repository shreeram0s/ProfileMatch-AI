import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Youtube, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  ExternalLink,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedYouTubeCard from '../components/EnhancedYouTubeCard';

const SuggestionsPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);

  useEffect(() => {
    // Get analysis data from localStorage
    const lastAnalysis = localStorage.getItem('lastAnalysis');
    const storedMissingSkills = localStorage.getItem('missingSkills');
    
    if (lastAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(lastAnalysis);
        console.log('📊 Analysis Data:', parsedAnalysis);
        console.log('🎥 YouTube Recommendations:', parsedAnalysis.youtube_recommendations);
        setAnalysisData(parsedAnalysis);
      } catch (e) {
        console.error('Error parsing last analysis:', e);
      }
    } else {
      console.log('⚠️ No analysis data found in localStorage');
    }
    
    if (storedMissingSkills) {
      try {
        const parsedSkills = JSON.parse(storedMissingSkills);
        console.log('🔍 Missing Skills:', parsedSkills);
        setMissingSkills(parsedSkills);
      } catch (e) {
        console.error('Error parsing missing skills:', e);
      }
    }
  }, []);

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
              AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Suggestions</span> & Learning
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Personalized recommendations to improve your skills and advance your career based on your analysis results
            </p>
          </motion.div>
        </div>
      </section>

      {/* AI Suggestions Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 bg-muted/50 rounded-3xl my-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Lightbulb className="h-8 w-8 text-primary" />
              AI-Powered Suggestions
            </h2>
            <p className="text-muted-foreground text-lg">
              Actionable insights to optimize your career profile
            </p>
          </div>
          
          {analysisData && analysisData.suggestions && analysisData.suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisData.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background border rounded-2xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-primary">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Recommendation #{index + 1}</h3>
                      <p className="text-muted-foreground">{suggestion}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Suggestions Available</h3>
              <p className="text-muted-foreground">
                Please complete an analysis to receive personalized suggestions.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Analyze Your Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Learning Resources Section - YouTube Style */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-background">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Youtube className="h-8 w-8 text-red-600" />
              Learning Resources
            </h2>
            <p className="text-muted-foreground text-lg">
              Personalized video tutorials to help you develop missing skills
            </p>
          </div>
          
          {analysisData && analysisData.youtube_recommendations && 
           Object.keys(analysisData.youtube_recommendations).length > 0 ? (
            <div className="space-y-10">
              {Object.entries(analysisData.youtube_recommendations).map(([skill, videos], skillIndex) => (
                videos && videos.length > 0 && (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: skillIndex * 0.1 }}
                    className="space-y-4"
                  >
                    {/* Skill Header - YouTube Style */}
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-border">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2.5 rounded-xl">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold capitalize">{skill}</h3>
                      <span className="ml-auto text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {videos.length} {videos.length === 1 ? 'video' : 'videos'}
                      </span>
                    </div>
                    
                    {/* YouTube-style Video Grid - Responsive */}
                    <div className="flex justify-center">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5 w-full">
                        {videos.map((video, videoIndex) => (
                          <EnhancedYouTubeCard 
                            key={videoIndex}
                            video={video}
                            skill={skill}
                            index={videoIndex}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Youtube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Learning Resources Available</h3>
              <p className="text-muted-foreground">
                Please complete an analysis to receive personalized learning recommendations.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Analyze Your Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Next Steps?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Discover job opportunities tailored to your skills and prepare for interviews
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors shadow-lg"
            >
              <ExternalLink className="h-5 w-5" />
              Find Jobs
            </Link>
            <Link
              to="/interview-prep"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              <GraduationCap className="h-5 w-5" />
              Interview Prep
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuggestionsPage;