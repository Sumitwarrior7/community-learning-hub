const asyncHandler = require('express-async-handler');
const CreditTransaction = require('../models/creditTransactionModel');
const User = require('../models/userModel');

const CREDIT_RATES = {
  content_view: 10,
  feed_engagement: 5,
  content_share: 15,
  premium_access: -50
};

const earnCredits = asyncHandler(async (req, res) => {
  const { activityType, contentId } = req.body;
  const user = req.user._id;
  
  const amount = CREDIT_RATES[activityType];
  const description = `Earned from ${activityType} - ${contentId}`;

  const transaction = await CreditTransaction.create({
    user, amount, type: 'earn', activityType, description
  });

  await User.findByIdAndUpdate(user, { $inc: { credits: amount } });
  
  res.status(201).json(transaction);
});

const spendCredits = asyncHandler(async (req, res) => {
  const { amount, contentId } = req.body;
  const user = await User.findById(req.user._id);

  if (user.credits < amount) {
    res.status(400);
    throw new Error(`Insufficient credits. Required: ${amount}, Available: ${user.credits}`);
  }

  const transaction = await CreditTransaction.create({
    user: user._id,
    amount: -amount,
    type: 'spend',
    activityType: 'premium_access',
    description: `Unlocked premium content: ${contentId}`
  });

  await User.findByIdAndUpdate(user._id, { $inc: { credits: -amount } });
  
  res.status(201).json(transaction);
});

const getTransactionHistory = asyncHandler(async (req, res) => {
  const transactions = await CreditTransaction.find({ user: req.user._id })
    .sort('-createdAt')
    .lean();
    
  res.json(transactions);
});

module.exports = {
  earnCredits,
  spendCredits,
  getTransactionHistory
};
