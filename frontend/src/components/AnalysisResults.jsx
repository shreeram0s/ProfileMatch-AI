import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  FileText, 
  Brain, 
  BarChart3, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Target,
  Award,
  Zap,
  ArrowRight,
  Code,
  Database,
  Globe,
  Shield,
  Cloud,
  Server,
  Box,
  GitBranch,
  Search,
  Terminal,
  Eye,
  Smartphone,
  Monitor,
  Layers,
  PenTool,
  Users,
  ShoppingCart,
  Apple,
  Facebook,
  Monitor as MonitorIcon,
  Factory,
  Flag,
  Users as UsersIcon,
  Building,
  TrendingUp as TrendingUpIcon,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

// Function to get a skill logo based on skill name
const getSkillLogo = (skillName) => {
  const skillLogos = {
    'python': <Code className="h-5 w-5 text-blue-500" />,
    'java': <Code className="h-5 w-5 text-red-500" />,
    'javascript': <Code className="h-5 w-5 text-yellow-500" />,
    'react': <Globe className="h-5 w-5 text-blue-400" />,
    'angular': <Globe className="h-5 w-5 text-red-600" />,
    'vue': <Globe className="h-5 w-5 text-green-500" />,
    'node.js': <Server className="h-5 w-5 text-green-600" />,
    'express': <Server className="h-5 w-5 text-gray-600" />,
    'sql': <Database className="h-5 w-5 text-blue-600" />,
    'mongodb': <Database className="h-5 w-5 text-green-600" />,
    'postgresql': <Database className="h-5 w-5 text-blue-700" />,
    'mysql': <Database className="h-5 w-5 text-blue-500" />,
    'django': <Server className="h-5 w-5 text-green-700" />,
    'flask': <Server className="h-5 w-5 text-gray-700" />,
    'spring': <Server className="h-5 w-5 text-green-600" />,
    'docker': <Box className="h-5 w-5 text-blue-500" />,
    'kubernetes': <Box className="h-5 w-5 text-blue-600" />,
    'aws': <Cloud className="h-5 w-5 text-orange-500" />,
    'azure': <Cloud className="h-5 w-5 text-blue-500" />,
    'gcp': <Cloud className="h-5 w-5 text-blue-400" />,
    'git': <GitBranch className="h-5 w-5 text-orange-600" />,
    'html': <Code className="h-5 w-5 text-orange-600" />,
    'css': <Code className="h-5 w-5 text-blue-500" />,
    'sass': <Code className="h-5 w-5 text-pink-500" />,
    'bootstrap': <Code className="h-5 w-5 text-purple-500" />,
    'typescript': <Code className="h-5 w-5 text-blue-600" />,
    'php': <Code className="h-5 w-5 text-purple-600" />,
    'c++': <Code className="h-5 w-5 text-blue-800" />,
    'c#': <Code className="h-5 w-5 text-purple-800" />,
    'ruby': <Code className="h-5 w-5 text-red-600" />,
    'rails': <Server className="h-5 w-5 text-red-600" />,
    'go': <Code className="h-5 w-5 text-blue-400" />,
    'rust': <Code className="h-5 w-5 text-orange-700" />,
    'swift': <Code className="h-5 w-5 text-orange-500" />,
    'kotlin': <Code className="h-5 w-5 text-purple-500" />,
    'scala': <Code className="h-5 w-5 text-red-500" />,
    'r': <Code className="h-5 w-5 text-blue-500" />,
    'matlab': <Code className="h-5 w-5 text-orange-500" />,
    'tensorflow': <Brain className="h-5 w-5 text-orange-600" />,
    'pytorch': <Brain className="h-5 w-5 text-red-600" />,
    'keras': <Brain className="h-5 w-5 text-red-700" />,
    'pandas': <Database className="h-5 w-5 text-gray-600" />,
    'numpy': <Database className="h-5 w-5 text-blue-500" />,
    'scikit-learn': <Brain className="h-5 w-5 text-orange-500" />,
    'matplotlib': <BarChart3 className="h-5 w-5 text-blue-500" />,
    'seaborn': <BarChart3 className="h-5 w-5 text-blue-400" />,
    'tableau': <BarChart3 className="h-5 w-5 text-orange-500" />,
    'power bi': <BarChart3 className="h-5 w-5 text-yellow-500" />,
    'excel': <BarChart3 className="h-5 w-5 text-green-600" />,
    'spark': <Zap className="h-5 w-5 text-red-500" />,
    'hadoop': <Server className="h-5 w-5 text-yellow-600" />,
    'kafka': <Zap className="h-5 w-5 text-blue-500" />,
    'redis': <Database className="h-5 w-5 text-red-600" />,
    'elasticsearch': <Search className="h-5 w-5 text-blue-500" />,
    'nginx': <Server className="h-5 w-5 text-green-600" />,
    'apache': <Server className="h-5 w-5 text-red-600" />,
    'linux': <Terminal className="h-5 w-5 text-black dark:text-white" />,
    'ubuntu': <Terminal className="h-5 w-5 text-orange-600" />,
    'centos': <Terminal className="h-5 w-5 text-blue-600" />,
    'bash': <Terminal className="h-5 w-5 text-gray-600" />,
    'powershell': <Terminal className="h-5 w-5 text-blue-600" />,
    'jenkins': <Zap className="h-5 w-5 text-red-600" />,
    'gitlab': <GitBranch className="h-5 w-5 text-orange-500" />,
    'github': <GitBranch className="h-5 w-5 text-black dark:text-white" />,
    'bitbucket': <GitBranch className="h-5 w-5 text-blue-500" />,
    'jira': <Target className="h-5 w-5 text-blue-500" />,
    'confluence': <FileText className="h-5 w-5 text-blue-500" />,
    'salesforce': <Cloud className="h-5 w-5 text-blue-600" />,
    'sap': <Server className="h-5 w-5 text-black dark:text-white" />,
    'oracle': <Database className="h-5 w-5 text-red-600" />,
    'qlik': <BarChart3 className="h-5 w-5 text-green-600" />,
    'looker': <BarChart3 className="h-5 w-5 text-purple-600" />,
    'snowflake': <Database className="h-5 w-5 text-blue-400" />,
    'redshift': <Database className="h-5 w-5 text-red-600" />,
    'bigquery': <Database className="h-5 w-5 text-blue-500" />,
    'databricks': <Database className="h-5 w-5 text-red-600" />,
    'airflow': <Zap className="h-5 w-5 text-orange-500" />,
    'mlflow': <Brain className="h-5 w-5 text-orange-600" />,
    'fastapi': <Server className="h-5 w-5 text-green-600" />,
    'graphql': <Code className="h-5 w-5 text-pink-500" />,
    'rest': <Server className="h-5 w-5 text-blue-500" />,
    'api': <Server className="h-5 w-5 text-blue-500" />,
    'microservices': <Server className="h-5 w-5 text-blue-600" />,
    'devops': <Zap className="h-5 w-5 text-orange-500" />,
    'ci/cd': <Zap className="h-5 w-5 text-blue-500" />,
    'agile': <Target className="h-5 w-5 text-green-500" />,
    'scrum': <Target className="h-5 w-5 text-orange-500" />,
    'kanban': <Target className="h-5 w-5 text-blue-500" />,
    'waterfall': <Target className="h-5 w-5 text-gray-500" />,
    'project management': <Target className="h-5 w-5 text-blue-500" />,
    'product management': <Target className="h-5 w-5 text-purple-500" />,
    'data analysis': <BarChart3 className="h-5 w-5 text-blue-500" />,
    'data science': <Brain className="h-5 w-5 text-blue-600" />,
    'machine learning': <Brain className="h-5 w-5 text-orange-500" />,
    'deep learning': <Brain className="h-5 w-5 text-purple-600" />,
    'natural language processing': <Brain className="h-5 w-5 text-green-600" />,
    'computer vision': <Eye className="h-5 w-5 text-blue-500" />,
    'blockchain': <Shield className="h-5 w-5 text-blue-600" />,
    'cybersecurity': <Shield className="h-5 w-5 text-red-500" />,
    'penetration testing': <Shield className="h-5 w-5 text-red-600" />,
    'encryption': <Shield className="h-5 w-5 text-gray-600" />,
    'firewall': <Shield className="h-5 w-5 text-red-700" />,
    'networking': <Globe className="h-5 w-5 text-blue-500" />,
    'system administration': <Terminal className="h-5 w-5 text-gray-600" />,
    'database administration': <Database className="h-5 w-5 text-blue-600" />,
    'cloud architecture': <Cloud className="h-5 w-5 text-blue-400" />,
    'solution architecture': <Server className="h-5 w-5 text-gray-600" />,
    'technical leadership': <Target className="h-5 w-5 text-purple-500" />,
    'team management': <UsersIcon className="h-5 w-5 text-blue-500" />,
    'software development': <Code className="h-5 w-5 text-blue-500" />,
    'web development': <Globe className="h-5 w-5 text-blue-500" />,
    'mobile development': <Smartphone className="h-5 w-5 text-blue-500" />,
    'frontend': <MonitorIcon className="h-5 w-5 text-blue-500" />,
    'backend': <Server className="h-5 w-5 text-gray-600" />,
    'fullstack': <Layers className="h-5 w-5 text-purple-500" />,
    'ui/ux': <PenTool className="h-5 w-5 text-pink-500" />,
    'design': <PenTool className="h-5 w-5 text-pink-500" />,
    'testing': <CheckCircle className="h-5 w-5 text-green-500" />,
    'qa': <CheckCircle className="h-5 w-5 text-green-500" />,
    'automation': <Zap className="h-5 w-5 text-yellow-500" />,
    'manual testing': <CheckCircle className="h-5 w-5 text-green-500" />,
    'unit testing': <CheckCircle className="h-5 w-5 text-green-500" />,
    'integration testing': <CheckCircle className="h-5 w-5 text-green-500" />,
    'performance testing': <Zap className="h-5 w-5 text-red-500" />
  };

  // Convert skill name to lowercase for matching
  const lowerSkillName = skillName.toLowerCase();
  
  // Try to find an exact match first
  if (skillLogos[lowerSkillName]) {
    return skillLogos[lowerSkillName];
  }
  
  // Try partial matches
  for (const [key, icon] of Object.entries(skillLogos)) {
    if (lowerSkillName.includes(key)) {
      return icon;
    }
  }
  
  // If no match found, return a default code icon
  return <Code className="h-5 w-5 text-gray-500" />;
};

const AnalysisResults = ({ analysisData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Helper function to safely get a rounded percentage value
  const getRoundedPercentage = (value) => {
    // Handle null, undefined, or non-numeric values
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check for NaN
    if (isNaN(numValue)) {
      return 0;
    }
    
    // Clamp to 0-100 range and round
    return Math.round(Math.max(0, Math.min(100, numValue)));
  };

  // Prepare data for charts
  const skillMatchData = [
    { name: 'Matched Skills', value: analysisData.resume_skills?.filter(skill => analysisData.job_skills?.includes(skill)).length || 0 },
    { name: 'Missing Skills', value: analysisData.missing_skills?.length || 0 },
  ];
  
  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div className="bg-background border rounded-2xl p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Brain className="h-4 w-4" />
          Skill Analysis
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'comparison'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Skill Comparison
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'suggestions'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          Suggestions
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">
                {getRoundedPercentage(analysisData.skill_match_score)}%
              </div>
              <div className="text-muted-foreground">Skill Match</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {getRoundedPercentage(analysisData.overall_score || analysisData.match_score)}%
              </div>
              <div className="text-muted-foreground">Overall Match</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {getRoundedPercentage(analysisData.semantic_similarity)}%
              </div>
              <div className="text-muted-foreground">Semantic Similarity</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Skill Match Overview
              </h3>
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
                  >
                    {skillMatchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skills Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="font-medium">Matched Skills</span>
                  </div>
                  <span className="text-2xl font-bold text-green-500">
                    {analysisData.resume_skills?.filter(skill => analysisData.job_skills?.includes(skill)).length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <span className="font-medium">Missing Skills</span>
                  </div>
                  <span className="text-2xl font-bold text-red-500">
                    {analysisData.missing_skills?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-blue-500" />
                    <span className="font-medium">Total Resume Skills</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-500">
                    {analysisData.resume_skills?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-purple-500" />
                    <span className="font-medium">Required Skills (JD)</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-500">
                    {analysisData.job_skills?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Skills in Your Resume
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.resume_skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center gap-1"
                  >
                    <div className="bg-green-500/20 p-1 rounded">
                      {getSkillLogo(skill)}
                    </div>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.missing_skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-red-500/10 text-red-700 dark:text-red-300 rounded-full text-sm flex items-center gap-1"
                  >
                    <div className="bg-red-500/20 p-1 rounded">
                      {getSkillLogo(skill)}
                    </div>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Job Description Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisData.job_skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-1"
                >
                  <div className="bg-blue-500/20 p-1 rounded">
                    {getSkillLogo(skill)}
                  </div>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Skills Match Details
              </h3>
              <div className="space-y-3">
                {analysisData.resume_skills?.filter(skill => analysisData.job_skills?.includes(skill)).map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-300">{skill}</span>
                  </div>
                ))}
                {analysisData.resume_skills?.filter(skill => analysisData.job_skills?.includes(skill)).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No matching skills found</p>
                )}
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Skills Gap Analysis
              </h3>
              <div className="space-y-3">
                {analysisData.missing_skills?.slice(0, 10).map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700 dark:text-red-300">{skill}</span>
                  </div>
                ))}
                {analysisData.missing_skills?.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No missing skills - Perfect match!</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Suggestions Tab */}
      {activeTab === 'suggestions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-muted/30 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI-Powered Suggestions
            </h3>
            <div className="space-y-4">
              {analysisData.suggestions && analysisData.suggestions.length > 0 ? (
                analysisData.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-background border rounded-lg">
                    <div className="mt-1 text-yellow-500">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <p className="text-foreground">{suggestion}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No specific suggestions available at this time.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalysisResults;