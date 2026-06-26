const express = require('express');
const { getNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.route('/').get(getNotices).post(createNotice);
router.route('/:id').put(updateNotice).delete(deleteNotice);

module.exports = router;
