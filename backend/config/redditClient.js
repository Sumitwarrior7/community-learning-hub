// config/redditClient.js
const axios = require('axios');

const getRedditAccessToken = async () => {
  const auth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post('https://www.reddit.com/api/v1/access_token', 
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': process.env.REDDIT_USER_AGENT || 'CommunityLearningHub/0.0.1 by yourusername'
      }
    }
  );

  return response.data.access_token;
};

module.exports = { getRedditAccessToken };
