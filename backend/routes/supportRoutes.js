const express = require('express');
const {
  getComplaints,
  createComplaint,
  updateComplaintStatus,
  getFeedback,
  createFeedback,
} = require('../controllers/supportController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/complaints').get(getComplaints).post(createComplaint);
router.route('/complaints/:id').put(admin, updateComplaintStatus);
router.route('/feedback').get(getFeedback).post(createFeedback);

module.exports = router;
