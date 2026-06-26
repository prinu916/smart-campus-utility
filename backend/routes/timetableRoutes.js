const express = require('express');
const {
  getTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} = require('../controllers/timetableController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.route('/').get(getTimetable).post(createTimetableEntry);
router.route('/:id').put(updateTimetableEntry).delete(deleteTimetableEntry);

module.exports = router;
