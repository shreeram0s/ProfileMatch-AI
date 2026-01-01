// Note: We do not use backend for this; use YouTube Data API directly.
// Exposes a function to fetch videos per skill using the browser and env key.

const API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

function getApiKey() {
  return import.meta.env.VITE_YOUTUBE_API_KEY;
}

export async function fetchYouTubeVideosForSkill(skill, maxResults = 4) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Missing VITE_YOUTUBE_API_KEY');
  }

  const params = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    type: 'video',
    q: `${skill} tutorial`,
    maxResults: String(maxResults),
    safeSearch: 'moderate',
  });

  const res = await fetch(`${API_ENDPOINT}?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API error: ${res.status} ${text}`);
  }
  const json = await res.json();
  const items = Array.isArray(json.items) ? json.items : [];

  return items.map((item) => {
    const id = item.id?.videoId;
    const sn = item.snippet || {};
    return {
      id,
      title: sn.title || 'Untitled',
      description: sn.description || '',
      channel: sn.channelTitle || '',
      thumbnail:
        sn.thumbnails?.high?.url ||
        sn.thumbnails?.medium?.url ||
        sn.thumbnails?.default?.url ||
        '',
      url: id ? `https://www.youtube.com/watch?v=${id}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}`,
    };
  });
}

export async function fetchYouTubeRecommendations(skills, maxPerSkill = 4) {
  const recommendations = {};
  for (const skill of skills || []) {
    try {
      const videos = await fetchYouTubeVideosForSkill(skill, maxPerSkill);
      recommendations[skill] = videos;
    } catch (e) {
      // On error or missing key, provide a search URL placeholder
      recommendations[skill] = [
        {
          id: null,
          title: `Search videos for ${skill}`,
          description: '',
          channel: '',
          thumbnail: '',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`,
        },
      ];
    }
  }
  return recommendations;
}

export default {
  fetchYouTubeVideosForSkill,
  fetchYouTubeRecommendations,
};