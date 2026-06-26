const Attendance = require('../models/Attendance');

// @desc Get attendance records (all for admin, own for student)
// @route GET /api/attendance
const getAttendance = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    if (req.query.subject) filter.subject = req.query.subject;

    const records = await Attendance.find(filter).sort({ date: -1 });

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

    // Per-subject breakdown
    const subjectMap = {};
    records.forEach((r) => {
      if (!subjectMap[r.subject]) subjectMap[r.subject] = { present: 0, total: 0 };
      subjectMap[r.subject].total += 1;
      if (r.status === 'present') subjectMap[r.subject].present += 1;
    });
    const subjectWise = Object.entries(subjectMap).map(([subject, v]) => ({
      subject,
      present: v.present,
      total: v.total,
      percentage: Number(((v.present / v.total) * 100).toFixed(2)),
    }));

    res.json({ records, summary: { total, present, absent: total - present, percentage }, subjectWise });
  } catch (error) {
    next(error);
  }
};

// @desc Add an attendance record
// @route POST /api/attendance
const addAttendance = async (req, res, next) => {
  try {
    const { subject, date, status } = req.body;
    if (!subject || !status) {
      return res.status(400).json({ message: 'Subject and status are required' });
    }

    const recordOwnerId = req.user.role === 'admin' && req.body.user ? req.body.user : req.user._id;
    const record = await Attendance.create({ user: recordOwnerId, subject, date, status });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

// @desc Update an attendance record
// @route PUT /api/attendance/:id
const updateAttendance = async (req, res, next) => {
  try {
    const record = req.user.role === 'admin'
      ? await Attendance.findById(req.params.id)
      : await Attendance.findOne({ _id: req.params.id, user: req.user._id });

    if (!record) return res.status(404).json({ message: 'Record not found' });

    Object.assign(record, req.body);
    const updated = await record.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc Delete an attendance record
// @route DELETE /api/attendance/:id
const deleteAttendance = async (req, res, next) => {
  try {
    const record = req.user.role === 'admin'
      ? await Attendance.findByIdAndDelete(req.params.id)
      : await Attendance.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record removed', _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAttendance, addAttendance, updateAttendance, deleteAttendance };
