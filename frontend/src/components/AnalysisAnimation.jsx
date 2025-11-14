import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Brain, 
  BarChart3, 
  Target, 
  Zap,
  Loader2,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const AnalysisAnimation = ({ isLoading, onComplete }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const animationSteps = [
    { 
      title: 'Scanning Document', 
      description: 'Extracting text from your documents',
      icon: <FileText className="h-12 w-12" />,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Processing Text', 
      description: 'Analyzing content with NLP algorithms',
      icon: <Brain className="h-12 w-12" />,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Identifying Skills', 
      description: 'Detecting key skills and qualifications',
      icon: <Zap className="h-12 w-12" />,
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      title: 'Comparing Skills', 
      description: 'Matching with job requirements',
      icon: <Target className="h-12 w-12" />,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      title: 'Generating Insights', 
      description: 'Creating personalized recommendations',
      icon: <BarChart3 className="h-12 w-12" />,
      color: 'from-pink-500 to-rose-600'
    }
  ];

  useEffect(() => {
    if (isLoading) {
      // Smooth progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const targetProgress = ((animationStep + 1) / animationSteps.length) * 100;
          const newProgress = prev + (targetProgress - prev) * 0.1;
          return Math.min(newProgress, targetProgress);
        });
      }, 50);

      const timer = setInterval(() => {
        setAnimationStep(prev => {
          if (prev < animationSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(timer);
            clearInterval(progressInterval);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 1000);
            return prev;
          }
        });
      }, 1500);
      
      return () => {
        clearInterval(timer);
        clearInterval(progressInterval);
      };
    } else {
      setAnimationStep(0);
      setProgress(0);
    }
  }, [isLoading, onComplete, animationSteps.length, animationStep]);

  if (!isLoading) return null;

  const currentStep = animationSteps[animationStep];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
      {/* Animated particles in background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="glass-effect border-2 rounded-3xl p-10 max-w-lg w-full mx-4 relative overflow-hidden shadow-2xl"
      >
        {/* Gradient background animation */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${currentStep.color} opacity-10`}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10">
          <div className="text-center mb-8">
            {/* Icon container with advanced animations */}
            <div className="relative h-40 w-40 mx-auto mb-8">
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Middle pulsing ring */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-primary/40"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Inner icon container */}
              <motion.div
                key={animationStep}
                initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: 180, opacity: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                className={`absolute inset-4 bg-gradient-to-br ${currentStep.color} rounded-full flex items-center justify-center shadow-2xl`}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-white"
                >
                  {currentStep.icon}
                </motion.div>
              </motion.div>
              
              {/* Floating particles around icon */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-primary rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 8) * Math.PI * 2) * 80,
                    y: Math.sin((i / 8) * Math.PI * 2) * 80,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: (i / 8) * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Title with animation */}
            <AnimatePresence mode="wait">
              <motion.h3
                key={`title-${animationStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold mb-3"
              >
                {currentStep.title}
              </motion.h3>
            </AnimatePresence>
            
            {/* Description with animation */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${animationStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-muted-foreground mb-8 text-lg"
              >
                {currentStep.description}
              </motion.p>
            </AnimatePresence>
            
            {/* Enhanced progress bar */}
            <div className="relative">
              <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className={`h-full bg-gradient-to-r ${currentStep.color} rounded-full relative overflow-hidden`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Progress percentage */}
              <motion.div
                className="text-center mt-4 font-semibold text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-primary">{Math.round(progress)}%</span>
                <span className="text-muted-foreground mx-2">•</span>
                <span className="text-muted-foreground">
                  Step {animationStep + 1} of {animationSteps.length}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisAnimation;