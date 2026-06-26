const Note = require('../models/Note');

// @desc Get all notes for logged-in user
// @route GET /api/notes
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc Create a note
// @route POST /api/notes
const createNote = async (req, res, next) => {
  try {
    const { title, content, color, pinned } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const note = await Note.create({ user: req.user._id, title, content, color, pinned });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc Update a note
// @route PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    Object.assign(note, req.body);
    const updated = await note.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete a note
// @route DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note removed', _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
