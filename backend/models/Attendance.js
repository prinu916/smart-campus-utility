const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['present', 'absent'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
