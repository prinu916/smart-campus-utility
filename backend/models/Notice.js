const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Notice title is required'], trim: true },
    content: { type: String, required: [true, 'Notice content is required'], trim: true },
    category: {
      type: String,
      enum: ['general', 'exam', 'event', 'holiday', 'urgent'],
      default: 'general',
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
