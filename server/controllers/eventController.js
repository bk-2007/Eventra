const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, category, type, date, venue, maxParticipants, image } = req.body;
  try {
    const event = await Event.create({
      title,
      description,
      category,
      type,
      date,
      venue,
      maxParticipants,
      image,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.category = req.body.category || event.category;
    event.type = req.body.type || event.type;
    event.date = req.body.date || event.date;
    event.venue = req.body.venue || event.venue;
    event.maxParticipants = req.body.maxParticipants !== undefined ? req.body.maxParticipants : event.maxParticipants;
    event.image = req.body.image || event.image;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
