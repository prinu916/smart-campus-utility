const mongoose = require('mongoose');

const timetableEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, trim: true, default: '' },
    faculty: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', timetableEntrySchema);
