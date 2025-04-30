// models/reportedContentModel.js
const mongoose = require('mongoose');

const reportedContentSchema = new mongoose.Schema({
  contentId: { type: String, required: true },
  contentType: { 
    type: String, 
    enum: ['twitter', 'reddit', 'linkedin'],
    required: true 
  },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'],
    default: 'pending'
  },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('ReportedContent', reportedContentSchema);
