const express = require('express');
const router = express.Router();
const { registerEvent, getRegistrations, markAttendance } = require('../controllers/registrationController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, registerEvent);
router.get('/', protect, getRegistrations);
router.put('/:id/attendance', protect, isAdmin, markAttendance);

module.exports = router;
