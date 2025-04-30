// controllers/redditController.js
const axios = require('axios');
const { getRedditAccessToken } = require('../config/redditClient');

const fetchRedditPosts = async (subreddit, limit = 10) => {
  try {
    const accessToken = await getRedditAccessToken();

    const response = await axios.get(`https://oauth.reddit.com/r/${subreddit}/hot`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.REDDIT_USER_AGENT || 'CommunityLearningHub/0.0.1 by yourusername'
      },
      params: {
        limit
      }
    });

    const posts = response.data.data.children;

    return posts.map(({ data: post }) => ({
      id: post.id,
      title: post.title,
      author: post.author,
      content: post.selftext || '',
      upvotes: post.ups,
      created_utc: post.created_utc,
      source: 'reddit',
      url: `https://reddit.com${post.permalink}`,
      thumbnail: post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : null,
    }));
  } catch (error) {
    console.error('Reddit API Error:', error?.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchRedditPosts };
