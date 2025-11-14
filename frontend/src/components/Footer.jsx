import { Link } from 'react-router-dom';
import { Brain, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t glass-effect">
      <div className="container py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/">
              <motion.div 
                className="flex items-center space-x-2 mb-6 group"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Brain className="h-10 w-10 text-primary" />
                </motion.div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-purple-600 group-hover:to-blue-500 transition-all duration-300">
                  ProFileMatch
                </span>
              </motion.div>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              AI-powered Resume Analyzer that helps you optimize your career profile using advanced NLP and Machine Learning.
            </p>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/home' },
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Suggestions', path: '/suggestions' },
                { name: 'Jobs', path: '/jobs' },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <motion.div
                      className="h-1 w-1 rounded-full bg-muted-foreground group-hover:bg-primary group-hover:w-3 transition-all"
                    />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Features
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Interview Prep', path: '/interview-prep' },
                { name: 'Export Analysis', path: '/export' },
                { name: 'Career Tips', path: '/suggestions' },
                { name: 'AI Insights', path: '/dashboard' },
              ].map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <motion.div
                      className="h-1 w-1 rounded-full bg-muted-foreground group-hover:bg-primary group-hover:w-3 transition-all"
                    />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} ProFileMatch. All rights reserved.
            </p>
            <motion.p 
              className="text-sm text-muted-foreground flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              Made with <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              </motion.span> by ProFileMatch Team
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;