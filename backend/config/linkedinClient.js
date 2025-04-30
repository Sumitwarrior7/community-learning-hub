// config/linkedinClient.js
const { RestliClient } = require('linkedin-api-client');

const linkedinClient = new RestliClient({
  accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
  versionString: '202405'
});

module.exports = linkedinClient;
