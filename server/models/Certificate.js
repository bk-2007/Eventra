const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    certificateType: {
      type: String,
      enum: ['participant', 'merit'],
      required: true,
    },
    certificateId: { type: String, required: true, unique: true }, // Unique ID for verification
    position: { type: String, trim: true }, // e.g. "1st Place" (only for merit)
    generatedDate: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', CertificateSchema);
