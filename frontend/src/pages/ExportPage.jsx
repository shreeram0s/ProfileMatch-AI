import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const reportRef = useRef(null);

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

  const handleExportPDF = async () => {
    setExporting(true);
    
    try {
      // Create PDF from the report element
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content is taller than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save('profilematch-analysis-report.pdf');
      
      setExportComplete(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportComplete(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Export Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Analysis</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Save your complete career analysis and recommendations as a professional PDF document
            </p>
          </motion.div>
        </div>
      </section>

      {/* Export Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted/50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Career Analysis Report</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Export your complete analysis with branded ProFileMatch template, including all insights, visualizations, and recommendations
              </p>
            </div>
            
            {analysisData ? (
              <div ref={reportRef} className="bg-background border rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-xl">Career Analysis Report</div>
                    <div className="text-sm text-muted-foreground">
                      Generated on {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Match Scores Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Match Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-500">
                        {getRoundedPercentage(analysisData.skill_match_score)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Skill Match</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {getRoundedPercentage(analysisData.overall_score || analysisData.match_score)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Overall Match</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {getRoundedPercentage(analysisData.semantic_similarity)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Semantic Similarity</div>
                    </div>
                  </div>
                </div>
                
                {/* Skills Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Resume Skills ({analysisData.resume_skills?.length || 0})</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.resume_skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Missing Skills ({analysisData.missing_skills?.length || 0})</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.missing_skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Detailed Analytics Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Detailed Analytics</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Skills in Resume:</span>
                        <span className="font-medium">{analysisData.resume_skills?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Skills in Job Description:</span>
                        <span className="font-medium">{analysisData.job_skills?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Matched Skills:</span>
                        <span className="font-medium">
                          {analysisData.resume_skills?.filter(skill => analysisData.job_skills?.includes(skill)).length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Missing Skills:</span>
                        <span className="font-medium">{analysisData.missing_skills?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Suggestions */}
                {analysisData.suggestions && analysisData.suggestions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">AI Recommendations</h3>
                    <div className="space-y-2">
                      {analysisData.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-background border rounded-2xl p-12 text-center mb-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Analysis Data Available</h3>
                <p className="text-muted-foreground mb-6">
                  Complete an analysis to generate a report for export.
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
            
            <div className="text-center">
              <button
                onClick={handleExportPDF}
                disabled={!analysisData || exporting || exportComplete}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
              >
                {exporting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating PDF...
                  </div>
                ) : exportComplete ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Export Complete!
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export as PDF
                  </div>
                )}
              </button>
              
              {exportComplete && (
                <div className="mt-4 text-green-500 flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Your report has been generated successfully!
                </div>
              )}
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-background border text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <Printer className="h-5 w-5" />
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Report Features */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included in Your Report</h2>
            <p className="text-muted-foreground text-lg">
              A comprehensive document with all your career insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-background border rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Detailed Analysis
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Resume skills extraction and categorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Job description skills analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Skill gap identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Match percentage calculations</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background border rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Visualizations & Recommendations
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Interactive charts and graphs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI-powered improvement suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Personalized learning resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Job recommendations based on skills</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Continue Your Career Journey</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Explore more features to advance your career with ProFileMatch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors shadow-lg"
            >
              <ArrowRight className="h-5 w-5" />
              Find Jobs
            </Link>
            <Link
              to="/interview-prep"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              Interview Prep
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

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

export default ExportPage;