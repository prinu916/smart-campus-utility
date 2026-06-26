const Notice = require('../models/Notice');

// @desc Get all notices (visible to all logged-in users)
// @route GET /api/notices
const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    next(error);
  }
};

// @desc Create a notice
// @route POST /api/notices
const createNotice = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const notice = await Notice.create({ title, content, category, postedBy: req.user._id });
    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
};

// @desc Update a notice
// @route PUT /api/notices/:id
const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    Object.assign(notice, req.body);
    const updated = await notice.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a notice
// @route DELETE /api/notices/:id
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice removed', _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotices, createNotice, updateNotice, deleteNotice };
