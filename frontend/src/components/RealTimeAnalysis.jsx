import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Brain, 
  Target, 
  Zap,
  AlertCircle 
} from 'lucide-react';

const stageIcons = {
  extraction: <FileText className="h-8 w-8" />,
  skills: <Target className="h-8 w-8" />,
  analysis: <Brain className="h-8 w-8" />,
  similarity: <Zap className="h-8 w-8" />,
  finalizing: <CheckCircle2 className="h-8 w-8" />
};

const stageNames = {
  extraction: 'Text Extraction',
  skills: 'Skill Detection',
  analysis: 'Deep Analysis',
  similarity: 'Match Calculation',
  finalizing: 'Finalizing Results'
};

const RealTimeAnalysis = ({ 
  progress, 
  stage, 
  message, 
  isConnected,
  error,
  onComplete 
}) => {
  useEffect(() => {
    if (progress === 100 && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl mx-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-effect rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift" />
          
          <div className="relative z-10">
            {/* Connection Status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </span>
              </div>
              <span className="text-3xl font-bold text-gradient">{progress}%</span>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-500">Analysis Error</p>
                    <p className="text-sm text-red-400 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                key={stage}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative"
              >
                {/* Pulsing ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl"
                />
                
                <div className="relative p-6 glass-effect rounded-full">
                  <motion.div
                    animate={{ rotate: progress === 100 ? 0 : 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-primary"
                  >
                    {stage && stageIcons[stage] ? stageIcons[stage] : <Loader2 className="h-8 w-8" />}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Stage Name */}
            <motion.h2
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-center mb-3"
            >
              {stage && stageNames[stage] ? stageNames[stage] : 'Initializing...'}
            </motion.h2>

            {/* Message */}
            <motion.p
              key={message}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground mb-8"
            >
              {message || 'Preparing analysis...'}
            </motion.p>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden"
              >
                <motion.div
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>

            {/* Stage Indicators */}
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(stageNames).map(([key, name], index) => {
                const stageProgress = {
                  extraction: 10,
                  skills: 30,
                  analysis: 50,
                  similarity: 70,
                  finalizing: 90
                };
                
                const isActive = stage === key;
                const isComplete = progress > stageProgress[key];
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`h-1 rounded-full mb-2 transition-colors ${
                      isComplete ? 'bg-green-500' : 
                      isActive ? 'bg-blue-500 animate-pulse' : 
                      'bg-muted'
                    }`} />
                    <p className={`text-xs transition-colors ${
                      isActive ? 'text-primary font-semibold' : 
                      isComplete ? 'text-green-500' : 
                      'text-muted-foreground'
                    }`}>
                      {name.split(' ')[0]}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Completion Animation */}
            <AnimatePresence>
              {progress === 100 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-3xl"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut"
                      }}
                    >
                      <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Analysis Complete!</h3>
                    <p className="text-muted-foreground">Loading your results...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RealTimeAnalysis;
