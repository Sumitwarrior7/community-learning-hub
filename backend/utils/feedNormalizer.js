// services/feedNormalizer.js
const normalizeFeed = (items, source) => {
    return items.map(item => ({
      id: `${source}_${item.id}`,
      title: item.title || item.text.substring(0, 100),
      content: item.content || item.text,
      source,
      url: item.url,
      metadata: {
        author: item.author,
        votes: item.upvotes || item.likes,
        timestamp: item.created_at || item.created_utc,
        thumbnail: item.thumbnail
      }
    }));
  };
  
  module.exports = { normalizeFeed };
  