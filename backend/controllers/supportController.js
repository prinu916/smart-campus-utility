const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');

const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const complaint = await Complaint.create({
      student: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      title,
      description,
      category,
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = req.body.status || complaint.status;
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

const createFeedback = async (req, res, next) => {
  try {
    const { subject, message, rating, category } = req.body;
    if (!subject || !message || !rating) {
      return res.status(400).json({ message: 'Subject, message, and rating are required' });
    }

    const feedbackEntry = await Feedback.create({
      student: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      subject,
      message,
      rating,
      category,
    });

    res.status(201).json(feedbackEntry);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplaints,
  createComplaint,
  updateComplaintStatus,
  getFeedback,
  createFeedback,
};
