import { motion } from 'framer-motion';

const GlassPanel = ({ 
  children, 
  className = '',
  animate = true,
  delay = 0
}) => {
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.95 } : {}}
      animate={animate ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: 'easeOut'
      }}
      className={`glass-effect rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassPanel;
