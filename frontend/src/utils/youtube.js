import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

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
  java: [
    {
      id: { videoId: 'grEKMHGYyns' },
      snippet: {
        title: 'Java Tutorial for Beginners',
        channelTitle: 'Programming with Mosh',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/grEKMHGYyns/hqdefault.jpg' } },
        description: 'Master the fundamentals of Java programming.'
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
  node: [
    {
      id: { videoId: 'TlB_eWDSMt4' },
      snippet: {
        title: 'Node.js Tutorial for Beginners',
        channelTitle: 'Programming with Mosh',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/TlB_eWDSMt4/hqdefault.jpg' } },
        description: 'Build backend applications with Node.js.'
      }
    }
  ],
  django: [
    {
      id: { videoId: 'F5mRW0jo-U4' },
      snippet: {
        title: 'Django Course',
        channelTitle: 'freeCodeCamp.org',
        thumbnails: { high: { url: 'https://i.ytimg.com/vi/F5mRW0jo-U4/hqdefault.jpg' } },
        description: 'Build web apps with Django.'
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
  ]
};

const GENERIC_FALLBACK_POOL = [
  {
    id: { videoId: 'rfscVS0vtbw' },
    snippet: {
      title: 'Learn Python - Full Course for Beginners [Tutorial]',
      channelTitle: 'freeCodeCamp.org',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg' } },
      description: 'Full introduction to Python core concepts.'
    }
  },
  {
    id: { videoId: '_uQrJ0TkZlc' },
    snippet: {
      title: 'Python Tutorial - Full Course for Beginners',
      channelTitle: 'Programming with Mosh',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg' } },
      description: 'Comprehensive Python tutorial for beginners.'
    }
  },
  {
    id: { videoId: 'PkZNo7MFNFg' },
    snippet: {
      title: 'Learn JavaScript - Full Course for Beginners',
      channelTitle: 'freeCodeCamp.org',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg' } },
      description: 'Complete JavaScript course for beginners.'
    }
  },
  {
    id: { videoId: 'W6NZfCO5SIk' },
    snippet: {
      title: 'JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour',
      channelTitle: 'Programming with Mosh',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg' } },
      description: 'Quick JavaScript crash course.'
    }
  },
  {
    id: { videoId: 'bMknfKXIFA8' },
    snippet: {
      title: 'React Course - Beginner\'s Tutorial',
      channelTitle: 'freeCodeCamp.org',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg' } },
      description: 'Comprehensive React course.'
    }
  },
  {
    id: { videoId: 'TlB_eWDSMt4' },
    snippet: {
      title: 'Node.js Tutorial for Beginners',
      channelTitle: 'Programming with Mosh',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/TlB_eWDSMt4/hqdefault.jpg' } },
      description: 'Backend development with Node.js.'
    }
  },
  {
    id: { videoId: 'F5mRW0jo-U4' },
    snippet: {
      title: 'Django Course',
      channelTitle: 'freeCodeCamp.org',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/F5mRW0jo-U4/hqdefault.jpg' } },
      description: 'Web apps with Django.'
    }
  },
  {
    id: { videoId: 'HXV3zeQKqGY' },
    snippet: {
      title: 'SQL Tutorial - Full Database Course',
      channelTitle: 'freeCodeCamp.org',
      thumbnails: { high: { url: 'https://i.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg' } },
      description: 'SQL and database fundamentals.'
    }
  }
];

const hashString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
};

const getFallbackVideos = (skill) => {
  const normalizedSkill = skill.toLowerCase();
  if (FALLBACK_RECOMMENDATIONS[normalizedSkill]) {
    const desired = 3;
    const baseList = [...FALLBACK_RECOMMENDATIONS[normalizedSkill]];
    if (baseList.length >= desired) return baseList.slice(0, desired);
    const existingIds = new Set(baseList.map(v => v.id.videoId));
    const base = hashString(skill);
    const poolSize = GENERIC_FALLBACK_POOL.length;
    let i = 0;
    while (baseList.length < desired && i < poolSize * 2) {
      const idx = (base + i) % poolSize;
      const item = GENERIC_FALLBACK_POOL[idx];
      if (!existingIds.has(item.id.videoId)) {
        baseList.push({
          id: { videoId: item.id.videoId },
          snippet: {
            title: `${item.snippet.title} • ${skill}`,
            channelTitle: item.snippet.channelTitle,
            thumbnails: item.snippet.thumbnails,
            description: `Recommended resource while you learn ${skill}.`
          },
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        });
        existingIds.add(item.id.videoId);
      }
      i++;
    }
    return baseList;
  }
  
  const count = 3;
  const base = hashString(skill);
  const poolSize = GENERIC_FALLBACK_POOL.length;
  const picks = [];
  for (let i = 0; i < count; i++) {
    const idx = (base + i) % poolSize;
    const item = GENERIC_FALLBACK_POOL[idx];
    picks.push({
      id: { videoId: item.id.videoId },
      snippet: {
        title: `${item.snippet.title} • ${skill}`,
        channelTitle: item.snippet.channelTitle,
        thumbnails: item.snippet.thumbnails,
        description: `Recommended resource while you learn ${skill}.`
      },
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    });
  }
  return picks;
};

export const fetchYouTubeRecommendations = async (skills) => {
  if (!skills || skills.length === 0) return {};

  const recommendations = {};
  
  // If no API key, return fallbacks immediately
  if (!YOUTUBE_API_KEY) {
    console.warn('No YouTube API key found, using fallback recommendations');
    skills.forEach(skill => {
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
  const promises = skills.map(async (skill) => {
    try {
      const response = await axios.get(YOUTUBE_API_URL, {
        params: {
          part: 'snippet',
          maxResults: 4,
          q: `learn ${skill} tutorial`,
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
