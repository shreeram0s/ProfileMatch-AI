import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  decimals = 0,
  className = ''
}) => {
  const counterRef = useRef(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;

    const element = counterRef.current;
    if (!element) return;

    const startValue = 0;
    const endValue = parseFloat(end);
    const startTime = Date.now();

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      element.textContent = prefix + currentValue.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + endValue.toFixed(decimals) + suffix;
      }
    };

    updateCounter();
  }, [inView, end, duration, suffix, prefix, decimals]);

  return (
    <span ref={ref}>
      <span ref={counterRef} className={className}>
        {prefix}0{suffix}
      </span>
    </span>
  );
};

export default AnimatedCounter;
