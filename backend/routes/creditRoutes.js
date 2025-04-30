const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { earnCredits, spendCredits, getTransactionHistory } = require('../controllers/creditController');

router.route('/earn')
  .post(protect, earnCredits);

router.route('/spend')
  .post(protect, spendCredits);

router.route('/history')
  .get(protect, getTransactionHistory);

module.exports = router;
