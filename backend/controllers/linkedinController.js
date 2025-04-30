// controllers/linkedinController.js
const linkedinClient = require('../config/linkedinClient');

const fetchLinkedInPosts = async (companyId, limit = 10) => {
  try {
    const response = await linkedinClient.get({
      resource: 'organizationPosts',
      queryParams: {
        q: 'author',
        author: `urn:li:organization:${companyId}`,
        count: limit
      }
    });
    
    return response.data.elements.map(post => ({
      id: post.id,
      title: post.commentary.text,
      author: post.author,
      likes: post.likesSummary.totalLikes,
      comments: post.commentsSummary.totalComments,
      created_at: post.created.time,
      source: 'linkedin',
      url: post.url
    }));
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    throw error;
  }
};

module.exports = { fetchLinkedInPosts };
