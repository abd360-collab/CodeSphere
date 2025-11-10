const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'system'],
    default: 'text'
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
