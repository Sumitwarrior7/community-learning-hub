// models/savedContentModel.js
const mongoose = require('mongoose');

const savedContentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  contentId: { type: String, required: true },
  contentType: {
    type: String,
    enum: ['twitter', 'reddit', 'linkedin'],
    required: true
  },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('SavedContent', savedContentSchema);
