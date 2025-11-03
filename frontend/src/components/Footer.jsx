import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                ProFileMatch
              </span>
            </div>
            <p className="text-muted-foreground max-w-md">
              AI-powered Resume Analyzer that helps you optimize your career profile.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/suggestions" className="text-muted-foreground hover:text-primary transition-colors">
                  Suggestions
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/interview-prep" className="text-muted-foreground hover:text-primary transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/export" className="text-muted-foreground hover:text-primary transition-colors">
                  Export
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect section removed as per user request */}
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ProFileMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;