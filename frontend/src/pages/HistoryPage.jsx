import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  History, 
  BarChart3, 
  FileText, 
  Calendar, 
  ArrowRight,
  Loader2,
  TrendingUp,
  Save,
  Eye,
  Search
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../apiClient';
import AnalysisResults from '../components/AnalysisResults';

const HistoryPage = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState([]);
  const [savedReports, setSavedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('saved'); // 'recent' or 'saved'
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedForSave, setSelectedForSave] = useState(null);
  const [saveName, setSaveName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchSavedReports = async () => {
    try {
      const response = await api.get('/api/user-reports/');
      setSavedReports(response.data.reports);
    } catch (err) {
      console.error('Error fetching saved reports:', err);
    }
  };

  const searchSavedReports = async () => {
    if (!searchTerm.trim()) return;
    setHasSearched(true);
    setSearchLoading(true);
    try {
      const response = await api.get('/api/report/by-name/', { params: { name: searchTerm.trim() } });
      setSavedReports(response.data.reports);
    } catch (err) {
      console.error('Error searching reports:', err);
    } finally {
      setSearchLoading(false);
    }
  };
  const deleteReportsByName = async () => {
    if (!searchTerm.trim()) return;
    setSearchLoading(true);
    try {
      await api.post('/api/report/delete/by-name/', { name: searchTerm.trim() });
      setSavedReports([]);
      setHasSearched(false);
      setSearchTerm('');
    } catch (err) {
      console.error('Error deleting reports:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // If a name param exists, auto-switch to Saved tab and run search
  useEffect(() => {
    const prefill = searchParams.get('name');
    if (prefill) {
      setActiveTab('saved');
      setSearchTerm(prefill);
      // Delay slightly to ensure tab content renders before search triggers
      setTimeout(() => {
        setHasSearched(true);
        searchSavedReports();
      }, 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveReport = async () => {
    if (!saveName.trim()) {
      setError('Please enter a name for the report');
      return;
    }
    
    setSaveLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/save-report/', {
        analysis_id: selectedForSave.id,
        name: saveName.trim()
      });
      
      // Add the new report to the saved reports list
      setSavedReports(prev => [response.data, ...prev]);
      
      // Switch to saved reports tab
      setActiveTab('saved');
      
      // Close modal
      setShowSaveModal(false);
      setSaveName('');
      setSelectedForSave(null);
    } catch (err) {
      setError('Error saving report. Please try again.');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const viewDetails = async (analysisId, isSavedReport = false) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (isSavedReport) {
        // For saved reports, fetch from the saved report endpoint
        response = await api.get(`/api/report/${analysisId}/`);
      } else {
        // For recent analyses, use the analyze endpoint
        response = await api.post('/api/analyze/', {
          analysis_id: analysisId
        });
      }
      
      setSelectedAnalysis(response.data);
      setShowDetails(true);
    } catch (err) {
      setError('Error fetching analysis details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reanalyze = async (analysisId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/analyze/', {
        analysis_id: analysisId
      });
      
      // Store in localStorage and navigate to results
      localStorage.setItem('lastAnalysis', JSON.stringify(response.data));
      navigate('/home');
    } catch (err) {
      setError('Error re-analyzing document. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (showDetails && selectedAnalysis) {
    return (
      <div className="min-h-screen container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              ← Back to History
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">Analysis Details</h1>
          </div>
          
          <AnalysisResults analysisData={selectedAnalysis} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Analysis History</h1>
          <p className="text-muted-foreground text-lg">
            Review your previous resume and job description analyses
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            {
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by report name..."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <Search className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    onClick={searchSavedReports}
                    disabled={searchLoading || !searchTerm.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </button>
                  <button
                    onClick={searchSavedReports}
                    disabled={searchLoading || !searchTerm.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </button>
                  {searchTerm.trim() && (
                    <button
                      onClick={deleteReportsByName}
                      disabled={searchLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={() => { setSearchTerm(''); setSavedReports([]); setHasSearched(false); }}
                    className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80"
                  >
                    Reset
                  </button>
                </div>
                {hasSearched && savedReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedReports.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-background border rounded-2xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{formatDate(report.created_at)}</span>
                          </div>
                          <div className={`text-2xl font-bold ${getMatchScoreColor(report.match_score)}`}>
                            {Math.round(report.match_score)}%
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Name</span>
                          </div>
                          <h3 className="text-lg font-semibold truncate">{report.name}</h3>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Match Score</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                              style={{ width: `${report.match_score}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">Report #{report.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewDetails(report.id, true)}
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Search saved reports by name</h3>
                    <p className="text-muted-foreground mb-6">
                      Enter a report name above to view saved results.
                    </p>
                  </div>
                )}
              </div>
            }
          </div>
        )}

        {/* Save Report Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4">Save Report</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Report Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Enter a name for this report..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setSaveName('');
                    setSelectedForSave(null);
                    setError(null);
                  }}
                  className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveReport}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Report
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
