// controllers/adminController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const ReportedContent = require('../models/reportedContentModel');
const SavedContent = require('../models/savedContentModel');


// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  user.role = req.body.role;
  await user.save();
  
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// @desc    Get reported content
// @route   GET /api/admin/reports
const getReportedContent = asyncHandler(async (req, res) => {
  const reports = await ReportedContent.find()
    .populate('reportedBy', 'name email')
    .populate('resolvedBy', 'name email');
    
  res.json(reports);
});

// @desc    Resolve report
// @route   PUT /api/admin/reports/:id
const resolveReport = asyncHandler(async (req, res) => {
  const report = await ReportedContent.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  
  report.status = req.body.status;
  report.resolvedBy = req.user._id;
  report.resolvedAt = Date.now();
  
  await report.save();
  res.json(report);
});

// @desc    Delete a report
// @route   DELETE /api/admin/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
  const report = await ReportedContent.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  await report.deleteOne();
  res.status(200).json({ message: 'Report deleted successfully' });
});


const getTopSavedContent = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 5;

    // Get all saved contents
    const savedContents = await SavedContent.find();

    // Count how many times each contentId appears
    const contentMap = new Map();

    for (const item of savedContents) {
      const key = `${item.contentId}-${item.contentType}`;
      if (!contentMap.has(key)) {
        contentMap.set(key, {
          contentId: item.contentId,
          contentType: item.contentType,
          metadata: item.metadata,
          count: 1,
        });
      } else {
        contentMap.get(key).count += 1;
      }
    }

    // Convert map to array, sort by count descending
    const sorted = [...contentMap.values()].sort((a, b) => b.count - a.count);

    // Send top N
    res.json(sorted.slice(0, limit));
  } catch (err) {
    console.error('Error in getTopSavedContent:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  getReportedContent,
  resolveReport,
  deleteReport,
  getTopSavedContent
};
