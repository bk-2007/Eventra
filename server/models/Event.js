const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['technical', 'non-technical'], required: true },
    type: { type: String, required: true, trim: true }, // e.g. "Individual", "Team (2-4)"
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    maxParticipants: { type: Number, required: true },
    image: { type: String }, // Banner URL
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
