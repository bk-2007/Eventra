const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
});

const RegistrationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    phone: { type: String, required: true }, // Leader phone
    registrationDate: { type: Date, default: Date.now },
    attendanceStatus: {
      type: String,
      enum: ['pending', 'present', 'absent'],
      default: 'pending',
      required: true,
    },
    certificateGenerated: { type: Boolean, default: false, required: true },
    isTeam: { type: Boolean, default: false, required: true },
    teamName: { type: String, trim: true },
    teamMembers: [TeamMemberSchema], // Array of other team members
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate registrations for the same user-event pair
RegistrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
