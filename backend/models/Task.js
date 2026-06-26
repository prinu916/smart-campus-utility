const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Task title is required'], trim: true },
    description: { type: String, trim: true, default: '' },
    type: { type: String, enum: ['task', 'assignment'], default: 'task' },
    subject: { type: String, trim: true, default: '' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
