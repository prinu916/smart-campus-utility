const express = require('express');
const {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.route('/').get(getAttendance).post(addAttendance);
router.route('/:id').put(updateAttendance).delete(deleteAttendance);

module.exports = router;
