require("dotenv").config();
const jwt = require('jsonwebtoken');

// Generating JWT token which will expire in 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;