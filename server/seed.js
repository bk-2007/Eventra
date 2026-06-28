const mongoose = require('mongoose');
const Event = require('./models/Event');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const technicalEvents = [
  {
    title: 'Coding Contest',
    description: 'Test your competitive programming skills in a timed algorithmic contest.',
    category: 'technical',
    type: 'Individual',
    date: new Date('2026-07-15T10:00:00.000Z'),
    venue: 'Lab 3, CS Block',
    maxParticipants: 100,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
  },
  {
    title: 'Debugging Challenge',
    description: 'Find and fix syntax, logic, and runtime errors in multiple programming languages.',
    category: 'technical',
    type: 'Individual',
    date: new Date('2026-07-15T14:00:00.000Z'),
    venue: 'Seminar Hall 1',
    maxParticipants: 80,
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3',
  },
  {
    title: 'DSA Challenge',
    description: 'Showcase your understanding of complex data structures and efficient algorithms.',
    category: 'technical',
    type: 'Individual',
    date: new Date('2026-07-16T09:30:00.000Z'),
    venue: 'Lab 5, IT Block',
    maxParticipants: 90,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  },
  {
    title: 'Technical Quiz',
    description: 'A fast-paced trivia challenge covering computer science, networks, and tech history.',
    category: 'technical',
    type: 'Team (2)',
    date: new Date('2026-07-16T13:00:00.000Z'),
    venue: 'Main Auditorium',
    maxParticipants: 50,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  },
  {
    title: '24-hr Hackathon',
    description: 'Build an innovative software product from scratch within a 24-hour coding sprint.',
    category: 'technical',
    type: 'Team (2-4)',
    date: new Date('2026-07-17T09:00:00.000Z'),
    venue: 'College Library Annex',
    maxParticipants: 30,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  },
  {
    title: 'AI Hackathon',
    description: 'Deploy machine learning and AI models to solve real-world industry problems.',
    category: 'technical',
    type: 'Team (2-4)',
    date: new Date('2026-07-18T10:00:00.000Z'),
    venue: 'AI Research Center',
    maxParticipants: 25,
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a',
  },
  {
    title: 'Tech Presentation',
    description: 'Present papers, research ideas, or case studies on emerging computing fields.',
    category: 'technical',
    type: 'Individual or Team (2)',
    date: new Date('2026-07-19T11:00:00.000Z'),
    venue: 'ECE Conference Hall',
    maxParticipants: 40,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  },
  {
    title: 'UI/UX Challenge',
    description: 'Design wireframes and high-fidelity mockups solving user-experience roadblocks.',
    category: 'technical',
    type: 'Individual',
    date: new Date('2026-07-19T14:30:00.000Z'),
    venue: 'Design Lab, Architecture Block',
    maxParticipants: 60,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c',
  },
  {
    title: 'Web Dev Challenge',
    description: 'Develop a highly responsive and feature-rich single page application.',
    category: 'technical',
    type: 'Individual',
    date: new Date('2026-07-20T10:00:00.000Z'),
    venue: 'Lab 1, CS Block',
    maxParticipants: 75,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12',
  },
  {
    title: 'Cybersecurity Challenge',
    description: 'Capture the flag style challenges involving reverse engineering and vulnerability scans.',
    category: 'technical',
    type: 'Individual or Team (2)',
    date: new Date('2026-07-21T09:00:00.000Z'),
    venue: 'Cyber Security Lab',
    maxParticipants: 40,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
  },
];

const nonTechnicalEvents = [
  {
    title: 'Movie Quiz',
    description: 'Trivia contest testing knowledge of classic and contemporary global cinema.',
    category: 'non-technical',
    type: 'Team (2)',
    date: new Date('2026-07-15T11:00:00.000Z'),
    venue: 'Seminar Hall 2',
    maxParticipants: 60,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
  },
  {
    title: 'Meme Challenge',
    description: 'Create hilarious memes about college life within a strict 30-minute window.',
    category: 'non-technical',
    type: 'Individual',
    date: new Date('2026-07-15T15:00:00.000Z'),
    venue: 'Online (Platform Submission)',
    maxParticipants: 150,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7',
  },
  {
    title: 'Reels Challenge',
    description: 'Record and edit engaging short video content around campus guidelines.',
    category: 'non-technical',
    type: 'Individual or Team (2)',
    date: new Date('2026-07-16T10:00:00.000Z'),
    venue: 'Campus-wide',
    maxParticipants: 100,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  },
  {
    title: 'General Debate',
    description: 'Formulate arguments and present structured positions on socio-economic topics.',
    category: 'non-technical',
    type: 'Individual',
    date: new Date('2026-07-16T14:00:00.000Z'),
    venue: 'Open Auditorium Stage',
    maxParticipants: 40,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
  },
  {
    title: 'JAM (Just A Minute)',
    description: 'Speak on a random topic for one full minute without hesitation or repetition.',
    category: 'non-technical',
    type: 'Individual',
    date: new Date('2026-07-17T11:00:00.000Z'),
    venue: 'Mechanical Seminar Hall',
    maxParticipants: 50,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
  },
  {
    title: 'Group Discussion',
    description: 'Demonstrate communication and group leadership dynamics in interactive rounds.',
    category: 'non-technical',
    type: 'Individual',
    date: new Date('2026-07-17T15:00:00.000Z'),
    venue: 'Placement Cell Group Room',
    maxParticipants: 80,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
  },
  {
    title: 'Treasure Hunt',
    description: 'Solve cryptic riddles across the campus to locate the final hidden chest.',
    category: 'non-technical',
    type: 'Team (3-4)',
    date: new Date('2026-07-18T09:00:00.000Z'),
    venue: 'Starts at College Fountain',
    maxParticipants: 40,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  },
  {
    title: 'Photography Challenge',
    description: 'Capture nature, campus architecture, and college emotions based on spot themes.',
    category: 'non-technical',
    type: 'Individual',
    date: new Date('2026-07-19T10:00:00.000Z'),
    venue: 'Campus Grounds',
    maxParticipants: 100,
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e',
  },
  {
    title: 'Drawing Competition',
    description: 'Sketch or paint on sheets provided, depicting a choice of cultural themes.',
    category: 'non-technical',
    type: 'Individual',
    date: new Date('2026-07-20T11:00:00.000Z'),
    venue: 'Fine Arts Room',
    maxParticipants: 75,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
  },
  {
    title: 'Talent Show',
    description: 'Singing, instrumentation, dancing, magic, stand-up comedy, show your talent.',
    category: 'non-technical',
    type: 'Individual or Group',
    date: new Date('2026-07-20T14:00:00.000Z'),
    venue: 'Main Auditorium',
    maxParticipants: 30,
    image: 'https://images.unsplash.com/photo-1460889687773-458c77c3504a',
  },
  {
    title: 'Fashion Walk',
    description: 'Theme-based ramp walk depicting historic styles or futuristic sustainability.',
    category: 'non-technical',
    type: 'Team (5-10)',
    date: new Date('2026-07-21T18:00:00.000Z'),
    venue: 'Amphitheater',
    maxParticipants: 15,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
  },
];

const seedDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventra';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing events to seed fresh
    await Event.deleteMany({});
    console.log('Deleted pre-existing events.');

    // Seed events
    const allSeedEvents = [...technicalEvents, ...nonTechnicalEvents];
    await Event.insertMany(allSeedEvents);
    console.log(`Successfully seeded ${allSeedEvents.length} events!`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
