// middleware/creditMiddleware.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const checkCredits = (requiredCredits) => asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (user.credits < requiredCredits) {
    res.status(400);
    throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits}`);
  }
  
  next();
});

module.exports = { checkCredits };
