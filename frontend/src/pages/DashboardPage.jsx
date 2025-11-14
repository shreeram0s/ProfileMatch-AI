import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  BarChart3, 
  PieChartIcon, 
  TrendingUp,
  ArrowRight,
  FileText,
  Target,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { useTheme } from '../components/theme-provider';

const DashboardPage = () => {
  const { theme } = useTheme();
  const [analysisData, setAnalysisData] = useState(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    // Get analysis data from localStorage
    const lastAnalysis = localStorage.getItem('lastAnalysis');
    
    if (lastAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(lastAnalysis);
        setAnalysisData(parsedAnalysis);
      } catch (e) {
        console.error('Error parsing last analysis:', e);
      }
    }
  }, []);

  // Prepare data for charts if analysisData exists
  const skillMatchData = analysisData ? [
    { name: 'Matched Skills', value: analysisData.resume_skills?.filter(skill => analysisData.job_skills?.includes(skill)).length || 0 },
    { name: 'Missing Skills', value: analysisData.missing_skills?.length || 0 },
  ] : [];

  const COLORS = ['#3b82f6', '#ef4444'];
  
  // Prepare bar chart data for skill frequencies
  const resumeSkillFreq = analysisData && analysisData.resume_keyword_freq ? 
    Object.entries(analysisData.resume_keyword_freq)
      .map(([skill, freq]) => ({ name: skill, frequency: freq }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10) : [];
  
  const jobSkillFreq = analysisData && analysisData.jd_keyword_freq ? 
    Object.entries(analysisData.jd_keyword_freq)
      .map(([skill, freq]) => ({ name: skill, frequency: freq }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10) : [];
  
  // Combine data for comparison chart
  const combinedSkillData = [];
  if (analysisData) {
    const allSkills = [...new Set([
      ...Object.keys(analysisData.resume_keyword_freq || {}), 
      ...Object.keys(analysisData.jd_keyword_freq || {})
    ])];
    
    allSkills.forEach(skill => {
      combinedSkillData.push({
        name: skill,
        resume: analysisData.resume_keyword_freq?.[skill] || 0,
        job: analysisData.jd_keyword_freq?.[skill] || 0
      });
    });
  }
  
  // Sort by job frequency and take top 10
  const sortedCombinedData = combinedSkillData
    .sort((a, b) => b.job - a.job)
    .slice(0, 10);
  
  // Prepare scatter plot data for skill comparison
  const scatterData = analysisData && analysisData.resume_skills ? 
    analysisData.resume_skills.map((skill, index) => ({
      x: index,
      y: analysisData.resume_keyword_freq?.[skill] || 0,
      z: analysisData.job_skills?.includes(skill) ? 200 : 100,
      skill: skill
    })) : [];

  // Helper function to safely get a rounded percentage value
  const getRoundedPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 0;
    }
    return Math.round(Math.max(0, Math.min(100, value)));
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground theme={theme} />
      
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
                <BarChart3 className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-gradient">Advanced Analytics</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Career{' '}
              <span className="text-gradient animate-gradient">Dashboard</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Visualize your skills, match scores, and career insights with interactive charts
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Content */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {analysisData ? (
            <div className="space-y-12">
              {/* Score Overview with Animated Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  {
                    value: getRoundedPercentage(analysisData.overall_score || analysisData.match_score),
                    label: 'Overall Match',
                    color: 'from-blue-500 to-blue-600',
                    icon: <Target className="h-8 w-8" />
                  },
                  {
                    value: getRoundedPercentage(analysisData.semantic_similarity),
                    label: 'Semantic Similarity',
                    color: 'from-purple-500 to-purple-600',
                    icon: <Brain className="h-8 w-8" />
                  },
                  {
                    value: getRoundedPercentage(analysisData.skill_match_score),
                    label: 'Skill Match',
                    color: 'from-pink-500 to-pink-600',
                    icon: <TrendingUp className="h-8 w-8" />
                  }
                ].map((stat, index) => (
                  <AnimatedCard
                    key={index}
                    delay={index * 0.1}
                    glassmorphism={true}
                    className="relative overflow-hidden"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <div className="relative z-10 text-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg`}
                      >
                        {stat.icon}
                      </motion.div>
                      <div className="text-5xl font-bold mb-2">
                        <span className="text-gradient">
                          <AnimatedCounter end={stat.value} suffix="%" duration={2000} />
                        </span>
                      </div>
                      <div className="text-muted-foreground font-medium">{stat.label}</div>
                    </div>
                  </AnimatedCard>
                ))}
              </motion.div>

              {/* Charts Grid - Enhanced with Animations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skill Distribution Pie Chart */}
                <AnimatedCard delay={0.3} glassmorphism={true}>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    >
                      <PieChartIcon className="h-5 w-5" />
                    </motion.div>
                    Skill Distribution
                  </h3>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={skillMatchData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {skillMatchData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </AnimatedCard>

                {/* Top Skills Bar Chart */}
                <AnimatedCard delay={0.4} glassmorphism={true}>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white"
                    >
                      <BarChart3 className="h-5 w-5" />
                    </motion.div>
                    Top Skills in Resume
                  </h3>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={resumeSkillFreq}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" scale="band" />
                        <Tooltip />
                        <Bar dataKey="frequency" fill="#3b82f6" name="Frequency" animationDuration={1000} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </AnimatedCard>

                {/* Skill Comparison Chart */}
                <AnimatedCard delay={0.5} className="lg:col-span-2" glassmorphism={true}>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                    >
                      <Target className="h-5 w-5" />
                    </motion.div>
                    Skill Frequency Comparison (Resume vs Job Description)
                  </h3>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={sortedCombinedData}
                        margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="resume" name="Resume Frequency" fill="#3b82f6" animationDuration={1000} />
                        <Bar dataKey="job" name="Job Description Frequency" fill="#8b5cf6" animationDuration={1000} animationBegin={200} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </AnimatedCard>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analysis Data Available</h3>
              <p className="text-muted-foreground mb-6">
                Complete an analysis to view your personalized dashboard with charts and graphs.
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

      {/* Next Step CTA */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Continue Your Career Journey</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get personalized suggestions and learning resources to improve your skills
          </p>
          <Link
            to="/suggestions"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            View Suggestions
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;