import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

const CANONICAL_SKILL_MAP = {
  'react.js': 'react',
  'reactjs': 'react',
  'js': 'javascript',
  'node': 'node.js',
  'nodejs': 'node.js',
  'postgres': 'sql',
  'postgresql': 'sql',
  'mysql': 'sql',
  'mssql': 'sql',
  'ms sql': 'sql',
  'sql server': 'sql',
  'oop': 'java',
  'frontend': 'javascript',
  'backend': 'python',
};

const canonicalizeSkill = (skill) => {
  const s = (skill || '').toLowerCase().trim();
  return CANONICAL_SKILL_MAP[s] || s.replace(/\s+/g, ' ');
};

// Fallback recommendations in case API fails or quota exceeded
const FALLBACK_RECOMMENDATIONS = {
  python: [
    {
      id: { videoId: 'rfscVS0vtbw' },
      snippet: {
        title: 'Learn Python - Full Course for Beginners [Tutorial]',
        channelTitle: 'freeCodeCamp.org',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg' } },
        description: 'This course will give you a full introduction into all of the core concepts in python.'
      }
    },
    {
      id: { videoId: '_uQrJ0TkZlc' },
      snippet: {
        title: 'Python Tutorial - Python Full Course for Beginners',
        channelTitle: 'Programming with Mosh',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg' } },
        description: 'Python tutorial for beginners - Learn Python for machine learning, web development, and more.'
      }
    }
  ],
  javascript: [
    {
      id: { videoId: 'PkZNo7MFNFg' },
      snippet: {
        title: 'Learn JavaScript - Full Course for Beginners',
        channelTitle: 'freeCodeCamp.org',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg' } },
        description: 'This complete 134-part JavaScript course will teach you everything you need to know to get started with the JavaScript programming language.'
      }
    }
  ],
  react: [
    {
      id: { videoId: 'bMknfKXIFA8' },
      snippet: {
        title: 'React Course - Beginner\'s Tutorial for React JavaScript Library [2022]',
        channelTitle: 'freeCodeCamp.org',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg' } },
        description: 'Learn React by building eight real-world projects and solving 140+ coding challenges.'
      }
    }
  ],
  sql: [
    {
      id: { videoId: 'HXV3zeQKqGY' },
      snippet: {
        title: 'SQL Tutorial - Full Database Course for Beginners',
        channelTitle: 'freeCodeCamp.org',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg' } },
        description: 'The course is designed for beginners to SQL and database management systems, and will introduce you to common database management topics.'
      }
    }
  ],
  django: [
    {
      id: { videoId: 'rHux0gMZ3Eg' },
      snippet: {
        title: 'Django Course - Full Tutorial for Beginners',
        channelTitle: 'freeCodeCamp.org',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/rHux0gMZ3Eg/hqdefault.jpg' } },
        description: 'Learn Django in this full course for beginners.'
      }
    },
    {
      id: { videoId: 'F5mRW0jo-U4' },
      snippet: {
        title: 'Django For Everybody - Full Python University Course',
        channelTitle: 'freeCodeCamp.org',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/F5mRW0jo-U4/hqdefault.jpg' } },
        description: 'Django tutorial taught by Dr. Chuck from the University of Michigan.'
      }
    },
    {
      id: { videoId: '_ph8GF84fX4' },
      snippet: {
        title: 'Django Tutorial for Beginners',
        channelTitle: 'Tech With Tim',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/_ph8GF84fX4/hqdefault.jpg' } },
        description: 'Build websites with Django step by step.'
      }
    }
  ]
};

const getFallbackVideos = (skill) => {
  const normalizedSkill = canonicalizeSkill(skill);
  if (FALLBACK_RECOMMENDATIONS[normalizedSkill]) {
    return FALLBACK_RECOMMENDATIONS[normalizedSkill];
  }
  
  // Generic fallback for unknown skills
  return [
    {
      id: { videoId: 'generic' },
      snippet: {
        title: `Learn ${skill} - Complete Tutorial`,
        channelTitle: 'Tech Education',
        thumbnails: { high: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' } },
        description: `Comprehensive guide to mastering ${skill} for beginners and advanced developers.`
      },
      url: `https://www.youtube.com/results?search_query=learn+${skill}`
    }
  ];
};

export const fetchYouTubeRecommendations = async (skills) => {
  if (!skills || skills.length === 0) return {};

  const recommendations = {};
  
  // If no API key, return fallbacks immediately
  if (!YOUTUBE_API_KEY) {
    console.warn('No YouTube API key found, using fallback recommendations');
    skills.forEach(s => {
      const skill = canonicalizeSkill(s);
      recommendations[skill] = getFallbackVideos(skill).map(video => ({
        video_id: video.id.videoId,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || '',
        description: video.snippet.description,
        url: video.url || `https://www.youtube.com/watch?v=${video.id.videoId}`,
        skill: skill
      }));
    });
    return recommendations;
  }

  // Fetch from API
  const promises = skills.map(async (s) => {
    const skill = canonicalizeSkill(s);
    try {
      const response = await axios.get(YOUTUBE_API_URL, {
        params: {
          part: 'snippet',
          maxResults: 3,
          q: `learn ${skill} tutorial programming`,
          key: YOUTUBE_API_KEY,
          type: 'video',
          relevanceLanguage: 'en'
        }
      });

      if (response.data.items && response.data.items.length > 0) {
        recommendations[skill] = response.data.items.map(item => ({
          video_id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
          description: item.snippet.description,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          skill: skill
        }));
      } else {
        // No results found, use fallback
        recommendations[skill] = getFallbackVideos(skill).map(video => ({
          video_id: video.id.videoId,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || '',
          description: video.snippet.description,
          url: video.url || `https://www.youtube.com/watch?v=${video.id.videoId}`,
          skill: skill
        }));
      }
    } catch (error) {
      console.error(`Error fetching videos for ${skill}:`, error);
      // On error (e.g. quota exceeded), use fallback
      recommendations[skill] = getFallbackVideos(skill).map(video => ({
        video_id: video.id.videoId,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url || '',
        description: video.snippet.description,
        url: video.url || `https://www.youtube.com/watch?v=${video.id.videoId}`,
        skill: skill
      }));
    }
  });

  await Promise.all(promises);
  return recommendations;
};
