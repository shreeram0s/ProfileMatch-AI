import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Info } from 'lucide-react';

const HeatMapAnalysis = ({ resumeText = '', jdText = '', resumeSkills = [], jdSkills = [], onClose }) => {
  // Split texts into sentences for analysis
  const resumeSentences = useMemo(() => {
    if (!resumeText) return [];
    return resumeText
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 20)
      .slice(0, 30);
  }, [resumeText]);

  const jdSentences = useMemo(() => {
    if (!jdText) return [];
    return jdText
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 20)
      .slice(0, 30);
  }, [jdText]);

  // Calculate match score for each resume sentence against JD
  const calculateMatchScore = (resumeSentence, jdSkills, jdText) => {
    let score = 0;
    const sentenceLower = resumeSentence.toLowerCase();
    const jdLower = jdText.toLowerCase();

    // Check for skill matches
    jdSkills.forEach(skill => {
      if (sentenceLower.includes(skill.toLowerCase())) {
        score += 30;
      }
    });

    // Check for keyword overlap
    const resumeWords = sentenceLower.split(/\s+/).filter(w => w.length > 3);
    const jdWords = jdLower.split(/\s+/).filter(w => w.length > 3);
    const commonWords = resumeWords.filter(w => jdWords.includes(w));
    score += (commonWords.length / resumeWords.length) * 70;

    return Math.min(100, Math.max(0, score));
  };

  const heatMapData = useMemo(() => {
    return resumeSentences.map((sentence, index) => ({
      id: index,
      text: sentence.trim(),
      score: calculateMatchScore(sentence, jdSkills, jdText),
    }));
  }, [resumeSentences, jdSkills, jdText]);

  const getHeatColor = (score) => {
    if (score >= 70) return 'from-green-500 to-emerald-600';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    if (score >= 30) return 'from-orange-500 to-red-500';
    return 'from-red-600 to-red-800';
  };

  const getHeatOpacity = (score) => {
    return Math.max(0.2, Math.min(1, score / 100));
  };

  const averageScore = useMemo(() => {
    if (!heatMapData.length) return 0;
    const sum = heatMapData.reduce((acc, item) => acc + item.score, 0);
    return Math.round(sum / heatMapData.length);
  }, [heatMapData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] glass-effect rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-gradient-to-b from-background to-transparent border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <span className="text-gradient">Resume Heat Map Analysis</span>
              </h2>
              <p className="text-muted-foreground">
                Visual representation of how well each section matches the job description
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 rounded-lg glass-effect hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Score Legend */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <span>Excellent Match (70-100%)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <span>Good Match (50-69%)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-500 to-red-500"></div>
              <span>Fair Match (30-49%)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-red-600 to-red-800"></div>
              <span>Poor Match (0-29%)</span>
            </div>
          </div>

          {/* Average Score */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 p-4 glass-effect rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Match Score:</span>
              <span className="text-2xl font-bold text-gradient">{averageScore}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${averageScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${getHeatColor(averageScore)}`}
              />
            </div>
          </motion.div>
        </div>

        {/* Heat Map Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)] custom-scrollbar">
          {heatMapData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {heatMapData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="relative group"
                >
                  <div
                    className="p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden"
                    style={{
                      borderColor: `hsl(${item.score * 1.2}, 70%, 50%)`,
                    }}
                  >
                    {/* Background heat gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${getHeatColor(item.score)}`}
                      style={{ opacity: getHeatOpacity(item.score) * 0.2 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Section {index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold px-3 py-1 rounded-full glass-effect">
                            {Math.round(item.score)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{item.text}</p>

                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full left-0 right-0 mt-2 p-3 glass-effect rounded-lg text-xs z-20">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold mb-1">Match Analysis:</p>
                            <p className="text-muted-foreground">
                              {item.score >= 70
                                ? 'Strong alignment with job requirements. Keep this section!'
                                : item.score >= 50
                                ? 'Good match. Consider adding more relevant keywords.'
                                : item.score >= 30
                                ? 'Moderate match. Enhance with skills from the job description.'
                                : 'Low match. Consider rewriting to better align with requirements.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No resume content available for heat map analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HeatMapAnalysis;
