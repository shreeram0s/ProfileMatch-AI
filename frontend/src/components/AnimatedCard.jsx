import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedCard = ({ 
  children, 
  delay = 0, 
  className = '',
  hover3d = false,
  glassmorphism = false,
  gradient = false
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const baseClasses = glassmorphism 
    ? 'glass-effect' 
    : gradient 
    ? 'gradient-border' 
    : 'bg-background border';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={hover3d ? { 
        y: -10,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      } : { y: -5 }}
      className={`${baseClasses} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${hover3d ? 'card-3d' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
