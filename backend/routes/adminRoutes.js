// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminOnly } = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  updateUserRole,
  getReportedContent,
  resolveReport,
  deleteReport,
  getTopSavedContent
} = require('../controllers/adminController');

router.route('/users')
  .get(protect, adminOnly, getAllUsers);

router.route('/users/:id/role')
  .put(protect, adminOnly, updateUserRole);

router.route('/reports')
  .get(protect, adminOnly, getReportedContent);

router.route('/reports/:id')
  .put(protect, adminOnly, resolveReport);

router.route('/reports/:id')
  .delete(protect, adminOnly, deleteReport);

router.route('/top-saved')
.get(protect, adminOnly, getTopSavedContent);

module.exports = router;
