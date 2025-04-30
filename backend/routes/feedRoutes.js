// routes/feedRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getAggregatedFeed,
  saveContent,
  unsaveContent,
  reportContent,
  getSavedContent ,
  getMockedAggregatedFeed,
  checkSaved
} = require('../controllers/feedController');

// router.get('/feeds', getAggregatedFeed);
router.get('/feeds', getMockedAggregatedFeed);
router.post('/save', protect, saveContent);
router.delete('/unsave',  protect, unsaveContent)
router.post('/report', protect, reportContent);
router.get('/saved', protect, getSavedContent);
router.get('/saved/check', protect, checkSaved);

module.exports = router;
