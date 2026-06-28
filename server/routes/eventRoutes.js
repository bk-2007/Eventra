const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', getEvents);
router.post('/', protect, isAdmin, createEvent);
router.put('/:id', protect, isAdmin, updateEvent);
router.delete('/:id', protect, isAdmin, deleteEvent);

module.exports = router;
