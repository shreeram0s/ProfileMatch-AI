import { useEffect, useRef, useState } from 'react';
import ForceGraph3D from 'force-graph';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

const SkillNetwork3D = ({ skills = [], missingSkills = [], onClose }) => {
  const graphRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    if (!skills.length && !missingSkills.length) return;

    // Create nodes and links for the skill network
    const nodes = [];
    const links = [];
    const centerNode = { id: 'center', name: 'Your Skills', group: 'center', val: 30 };
    nodes.push(centerNode);

    // Add skill nodes
    skills.forEach((skill, index) => {
      const skillNode = {
        id: `skill-${index}`,
        name: skill,
        group: 'present',
        val: 15
      };
      nodes.push(skillNode);
      links.push({
        source: 'center',
        target: `skill-${index}`,
        strength: 1
      });
    });

    // Add missing skill nodes
    missingSkills.forEach((skill, index) => {
      const skillNode = {
        id: `missing-${index}`,
        name: skill,
        group: 'missing',
        val: 12
      };
      nodes.push(skillNode);
      links.push({
        source: 'center',
        target: `missing-${index}`,
        strength: 0.5
      });
    });

    // Create connections between related skills
    const allSkills = [...skills, ...missingSkills];
    for (let i = 0; i < Math.min(allSkills.length, 20); i++) {
      for (let j = i + 1; j < Math.min(allSkills.length, 20); j++) {
        if (Math.random() > 0.85) {
          const sourceId = i < skills.length ? `skill-${i}` : `missing-${i - skills.length}`;
          const targetId = j < skills.length ? `skill-${j}` : `missing-${j - skills.length}`;
          links.push({
            source: sourceId,
            target: targetId,
            strength: 0.3
          });
        }
      }
    }

    setGraphData({ nodes, links });
  }, [skills, missingSkills]);

  useEffect(() => {
    if (!containerRef.current || !graphData.nodes.length) return;

    const Graph = ForceGraph3D()(containerRef.current)
      .graphData(graphData)
      .nodeLabel('name')
      .nodeAutoColorBy('group')
      .nodeColor(node => {
        if (node.group === 'center') return '#8b5cf6';
        if (node.group === 'present') return '#3b82f6';
        return '#ef4444';
      })
      .nodeResolution(16)
      .linkWidth(2)
      .linkOpacity(0.4)
      .linkColor(() => 'rgba(255, 255, 255, 0.2)')
      .backgroundColor('#0a0a0a')
      .enableNodeDrag(true)
      .enableNavigationControls(true)
      .showNavInfo(false)
      .onNodeClick(node => {
        // Highlight clicked node
        Graph.nodeColor(n => {
          if (n.id === node.id) return '#fbbf24';
          if (n.group === 'center') return '#8b5cf6';
          if (n.group === 'present') return '#3b82f6';
          return '#ef4444';
        });
      });

    graphRef.current = Graph;

    // Animate camera
    const distance = 300;
    let angle = 0;
    const intervalId = setInterval(() => {
      angle += Math.PI / 300;
      Graph.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
      });
    }, 50);

    return () => {
      clearInterval(intervalId);
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, [graphData]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md ${
        isFullscreen ? 'p-0' : 'p-4 md:p-8'
      }`}
    >
      <div className={`relative w-full h-full ${isFullscreen ? '' : 'max-w-7xl max-h-[90vh]'} glass-effect rounded-2xl overflow-hidden`}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">3D Skill Network</h2>
              <p className="text-gray-300 text-sm">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Your Skills ({skills.length})
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mx-2 ml-6"></span>
                Missing Skills ({missingSkills.length})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="p-3 rounded-lg glass-effect hover:bg-white/10 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5 text-white" />
                ) : (
                  <Maximize2 className="h-5 w-5 text-white" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-3 rounded-lg glass-effect hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* 3D Graph Container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Controls Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
            <span>🖱️ Click & Drag to rotate</span>
            <span>🔍 Scroll to zoom</span>
            <span>👆 Click nodes to highlight</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillNetwork3D;
