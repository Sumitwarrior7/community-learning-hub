// controllers/twitterController.js
const twitterClient = require('../config/twitterClient');

const fetchTweets = async (query, limit = 10) => {
  try {
    const tweets = await twitterClient.v2.search(query, {
      'tweet.fields': ['created_at', 'public_metrics'],
      expansions: ['author_id'],
      max_results: limit,
    });

    return tweets.data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      author: tweet.author_id,
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      created_at: tweet.created_at,
      source: 'twitter',
      url: `https://twitter.com/i/status/${tweet.id}`
    }));
  } catch (error) {
    console.error('Twitter API Error:', error);
    throw error;
  }
};

module.exports = { fetchTweets };
