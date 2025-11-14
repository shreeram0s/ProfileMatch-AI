import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Code, 
  Zap, 
  Database, 
  Brain, 
  Cpu, 
  Lightbulb, 
  Users, 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  Download,
  FileText,
  BarChart3,
  Target,
  Award,
  Upload,
  Star,
  TrendingUp,
  Shield,
  Rocket
} from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AnimatedCard from '../components/AnimatedCard';
import { useTheme } from '../components/theme-provider';

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

const workflowSteps = [
  {
    icon: <Upload className="h-6 w-6" />,
    title: 'Upload Documents',
    description: 'Upload your resume and job description in PDF, DOCX, or TXT format'
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'AI Analysis',
    description: 'Our AI analyzes your skills and experiences using NLP and ML algorithms'
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Get Insights',
    description: 'Receive personalized recommendations and skill gap analysis'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Visualize Data',
    description: 'View detailed analytics and visualizations of your skills'
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: 'Learn & Improve',
    description: 'Access personalized learning resources for skill development'
  },
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: 'Find Opportunities',
    description: 'Discover job matches based on your profile and skills'
  },
  {
    icon: <UserCheck className="h-6 w-6" />,
    title: 'Prepare & Apply',
    description: 'Get interview prep materials and export your analysis'
  }
];

const technologies = [
  {
    category: 'Frontend',
    techs: [
      { name: 'React', icon: <Code className="h-5 w-5" /> },
      { name: 'Vite', icon: <Zap className="h-5 w-5" /> },
      { name: 'Tailwind CSS', icon: <Sparkles className="h-5 w-5" /> },
      { name: 'Framer Motion', icon: <Zap className="h-5 w-5" /> }
    ]
  },
  {
    category: 'Backend',
    techs: [
      { name: 'Django', icon: <Database className="h-5 w-5" /> },
      { name: 'PostgreSQL', icon: <Database className="h-5 w-5" /> },
      { name: 'REST API', icon: <Globe className="h-5 w-5" /> }
    ]
  },
  {
    category: 'AI/NLP/ML',
    techs: [
      { name: 'spaCy', icon: <Brain className="h-5 w-5" /> },
      { name: 'NLTK', icon: <Brain className="h-5 w-5" /> },
      { name: 'scikit-learn', icon: <Cpu className="h-5 w-5" /> },
      { name: 'TF-IDF', icon: <Lightbulb className="h-5 w-5" /> }
    ]
  },
  {
    category: 'APIs',
    techs: [
      { name: 'Adzuna', icon: <Briefcase className="h-5 w-5" /> },
      { name: 'YouTube', icon: <Users className="h-5 w-5" /> }
    ]
  }
];

const targetUsers = [
  {
    title: 'Job Seekers',
    description: 'Professionals looking to optimize their resumes and find better job opportunities.'
  },
  {
    title: 'Career Changers',
    description: 'Individuals transitioning to new fields who need guidance on skill development.'
  },
  {
    title: 'Students',
    description: 'Graduates preparing to enter the job market and build their professional profiles.'
  },
  {
    title: 'Recruiters',
    description: 'HR professionals who want to quickly analyze candidate profiles and match them with positions.'
  }
];

const LandingPage = () => {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen relative">
      {/* Particle Background */}
      <ParticleBackground theme={theme} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-32 relative">
        <motion.div 
          ref={heroRef}
          style={{ opacity, scale }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full text-sm font-medium mb-8"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-gradient">AI-Powered Career Analysis Platform</span>
            </motion.div>
            
            <div className="flex justify-center mb-8">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full blur-2xl opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full">
                  <Brain className="h-20 w-20 text-white" />
                </div>
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-gradient animate-gradient">
                ProFileMatch
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transform your career with{' '}
              <span className="text-primary font-semibold">AI-powered</span>{' '}
              resume analysis, intelligent insights, and personalized recommendations
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full overflow-hidden shadow-2xl"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <span className="relative flex items-center gap-3">
                  <Rocket className="h-5 w-5" />
                  Get Started Free
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-24 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Powerful Features</span>
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{' '}
              <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools and insights to optimize your career profile
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard
                key={index}
                delay={index * 0.1}
                hover3d={true}
                glassmorphism={index % 2 === 0}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg"
                >
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 sm:px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-transparent to-muted/50 rounded-3xl -z-10" />
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in minutes with our simple, powerful workflow
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflowSteps.slice(0, 6).map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -15,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="relative"
              >
                <div className="glass-effect rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 h-full">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg"
                  >
                    {step.icon}
                  </motion.div>
                  <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10"
                  >
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Used */}
      <section className="container mx-auto px-4 sm:px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powered by <span className="text-gradient">Modern Tech</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with cutting-edge tools and frameworks for optimal performance
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: categoryIndex * 0.1,
                  type: "spring"
                }}
                whileHover={{ 
                  y: -10,
                  rotateY: 10,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="glass-effect rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 card-3d"
              >
                <h3 className="text-lg font-semibold mb-6 text-center flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.techs.map((tech, techIndex) => (
                    <motion.div 
                      key={techIndex} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                      whileHover={{ x: 10, scale: 1.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.3 }}
                        transition={{ duration: 0.5 }}
                        className="text-primary"
                      >
                        {tech.icon}
                      </motion.div>
                      <span className="font-medium">{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="container mx-auto px-4 sm:px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30 rounded-3xl -z-10" />
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="text-gradient">Everyone</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're starting out or leveling up your career
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {targetUsers.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
                <div className="glass-effect p-8 relative">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg"
                  >
                    <Users className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-3">{user.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {user.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 animate-gradient" />
          <div className="relative p-12 md:p-16 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of professionals who've already optimized their career journey
              </p>
              <Link to="/home">
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-white text-blue-600 font-bold rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3 mx-auto"
                >
                  <Rocket className="h-6 w-6" />
                  Start Free Analysis
                  <ArrowRight className="h-6 w-6" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;