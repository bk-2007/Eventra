const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// Register for an event
exports.registerEvent = async (req, res) => {
  const { eventId, isTeam, phone, teamName, teamMembers } = req.body;
  const studentId = req.user._id;

  try {
    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // 2. Prevent duplicate: Check if current user is already registered as leader/individual
    const alreadyRegisteredLeader = await Registration.findOne({ studentId, eventId });
    if (alreadyRegisteredLeader) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    // 3. Prevent duplicate: Check if current user is already registered as a team member elsewhere
    const currentUser = await User.findById(studentId);
    const alreadyRegisteredMember = await Registration.findOne({
      eventId,
      'teamMembers.email': currentUser.email,
    });
    if (alreadyRegisteredMember) {
      return res.status(400).json({
        message: `You are already registered for this event under team "${alreadyRegisteredMember.teamName}".`,
      });
    }

    // 4. If team registration, validate team members and check duplicate status for each
    if (isTeam) {
      if (!teamName) {
        return res.status(400).json({ message: 'Team name is required for team registration.' });
      }
      if (!teamMembers || teamMembers.length === 0) {
        return res.status(400).json({ message: 'Please add at least one team member.' });
      }

      // Check duplicates for each team member
      for (const member of teamMembers) {
        // A: Check if this member is registered as a leader / individual
        const memberUserObj = await User.findOne({ email: member.email });
        if (memberUserObj) {
          const leaderDuplicate = await Registration.findOne({ studentId: memberUserObj._id, eventId });
          if (leaderDuplicate) {
            return res.status(400).json({
              message: `Team member ${member.name} (${member.email}) is already registered individually or as a leader of another team.`,
            });
          }
        }

        // B: Check if this member is registered as a member in another team
        const memberDuplicate = await Registration.findOne({
          eventId,
          $or: [
            { 'teamMembers.email': member.email },
            { 'teamMembers.rollNumber': member.rollNumber },
          ],
        });
        if (memberDuplicate) {
          return res.status(400).json({
            message: `Team member ${member.name} is already registered under team "${memberDuplicate.teamName}".`,
          });
        }
      }
    }

    // 5. Create registration
    const registration = await Registration.create({
      studentId,
      eventId,
      phone,
      isTeam: isTeam || false,
      teamName: isTeam ? teamName : undefined,
      teamMembers: isTeam ? teamMembers : undefined,
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get registrations (Admin gets all, Student gets own)
exports.getRegistrations = async (req, res) => {
  try {
    let query = {};
    
    // If student, filter by studentId (own registrations)
    if (req.user.role === 'student') {
      // Also match if student email appears in teamMembers list!
      query = {
        $or: [
          { studentId: req.user._id },
          { 'teamMembers.email': req.user.email }
        ]
      };
    }

    const registrations = await Registration.find(query)
      .populate('studentId', 'name email rollNumber branch year')
      .populate('eventId', 'title description category type date venue image maxParticipants')
      .sort({ registrationDate: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark attendance (Admin only)
exports.markAttendance = async (req, res) => {
  const { attendanceStatus } = req.body;
  if (!['pending', 'present', 'absent'].includes(attendanceStatus)) {
    return res.status(400).json({ message: 'Invalid attendance status' });
  }

  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.attendanceStatus = attendanceStatus;
    const updated = await registration.save();
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
