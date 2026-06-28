import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { technicalEvents, nonTechnicalEvents } from '../services/mockData';
import { ArrowRight, Code, Users, Award, Calendar, MapPin, Mail, Phone, MapPin as MapPinIcon } from 'lucide-react';

const Home = () => {
  const [dbEvents, setDbEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/api/events');
        setDbEvents(response.data);
      } catch (err) {
        console.log('Error fetching events from API, using mock data instead', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Use DB events if loaded, otherwise fall back to mock events
  const getUpcomingEvents = () => {
    if (dbEvents.length > 0) {
      return dbEvents.slice(0, 3);
    }
    // Mix and select 3 upcoming events from mock
    return [technicalEvents[0], nonTechnicalEvents[0], technicalEvents[4]];
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const upcoming = getUpcomingEvents();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-lightgray">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-maroon">
            Welcome to College Event Portal
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-black opacity-80 font-sans">
            Plan, register, and automate your college event participation. Get verified participation and merit certificates instantly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/events/technical"
              className="w-full sm:w-auto px-8 py-3 bg-maroon text-white font-medium rounded-md hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <span>Explore Technical Events</span>
              <Code className="h-5 w-5" />
            </Link>
            <Link
              to="/events/non-technical"
              className="w-full sm:w-auto px-8 py-3 border border-maroon text-maroon font-medium rounded-md hover:bg-lightgray/10 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore Non-Technical Events</span>
              <Users className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features summary */}
      <section className="py-12 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-lightgray">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-lightgray rounded-lg text-center space-y-3">
            <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full mb-2">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-display font-semibold text-lg text-maroon">Seamless Events</h3>
            <p className="text-black opacity-80 text-sm">
              Discover and register for technical challenges, hackathons, and creative cultural events in one central hub.
            </p>
          </div>

          <div className="p-6 border border-lightgray rounded-lg text-center space-y-3">
            <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full mb-2">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-display font-semibold text-lg text-maroon">Team Collaborations</h3>
            <p className="text-black opacity-80 text-sm">
              Register individually or assemble standard teams with roll numbers to participate in team challenges.
            </p>
          </div>

          <div className="p-6 border border-lightgray rounded-lg text-center space-y-3">
            <div className="inline-flex p-3 bg-lightgray/10 text-maroon rounded-full mb-2">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-display font-semibold text-lg text-maroon">Automated Certificates</h3>
            <p className="text-black opacity-80 text-sm">
              Download instant, verified PDF certificates of merit and participation directly from your student dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-lightgray">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-maroon">Upcoming Featured Events</h2>
            <p className="text-black opacity-80 mt-1">Get registered before the participant slots fill up!</p>
          </div>
          <Link
            to="/events/technical"
            className="text-maroon hover:opacity-80 flex items-center space-x-1 font-semibold text-sm mt-4 sm:mt-0"
          >
            <span>Browse All Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcoming.map((event) => (
            <div key={event.id || event._id} className="border border-lightgray rounded-lg bg-white overflow-hidden flex flex-col hover:shadow-sm transition-shadow">
              <div className="h-48 bg-lightgray overflow-hidden relative">
                <img
                  src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-3 py-1 bg-maroon text-white text-xs font-semibold rounded-full capitalize">
                  {event.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <h3 className="text-xl font-display font-bold text-maroon">{event.title}</h3>
                <p className="text-black opacity-85 text-sm line-clamp-3 flex-grow">{event.description}</p>
                <div className="space-y-2 pt-2 border-t border-lightgray text-sm text-black opacity-80">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-maroon" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-maroon" />
                    <span>{event.venue}</span>
                  </div>
                </div>
                <Link
                  to={event.category === 'technical' ? '/events/technical' : '/events/non-technical'}
                  className="mt-4 block text-center px-4 py-2 bg-maroon text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  Register Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-lightgray">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-maroon">About Eventra Portal</h2>
            <p className="text-black opacity-85 text-md leading-relaxed">
              Eventra is the definitive event planning and registration platform for our college. Built to foster innovation and student participation, our portal acts as a bridge between event organizers and students.
            </p>
            <p className="text-black opacity-85 text-md leading-relaxed">
              By replacing paper rosters and manual design cycles, Eventra enables instant student onboarding, standard team formulations, real-time analytics, and automated PDF certificate issuance based on attendance and merits.
            </p>
          </div>
          <div className="bg-lightgray/10 border border-lightgray rounded-xl p-8 space-y-6">
            <h3 className="font-display font-bold text-xl text-maroon">Our Standard Operations</h3>
            <ul className="space-y-3 text-black opacity-85">
              <li className="flex items-start space-x-2">
                <span className="text-maroon font-bold mr-2">&bull;</span>
                <span>Fully digital individual and team sign-ups.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-maroon font-bold mr-2">&bull;</span>
                <span>Verification of attendance on-site by faculty coordinators.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-maroon font-bold mr-2">&bull;</span>
                <span>Secure bulk certificate generation using PDF templates.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-maroon font-bold mr-2">&bull;</span>
                <span>Detailed statistics dashboard tracking event popularity metrics.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl font-display font-bold text-maroon">Get in Touch</h2>
          <p className="text-black opacity-80">Have questions about upcoming schedules, sponsorships, or merit details? Drop us a line.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="border border-lightgray p-4 rounded-lg text-center space-y-2">
            <Mail className="h-5 w-5 text-maroon mx-auto" />
            <h4 className="font-semibold text-maroon">Email Support</h4>
            <p className="text-sm text-black opacity-85">events@college.edu</p>
          </div>
          <div className="border border-lightgray p-4 rounded-lg text-center space-y-2">
            <Phone className="h-5 w-5 text-maroon mx-auto" />
            <h4 className="font-semibold text-maroon">Call Helpline</h4>
            <p className="text-sm text-black opacity-85">+1 (555) 123-4567</p>
          </div>
          <div className="border border-lightgray p-4 rounded-lg text-center space-y-2">
            <MapPinIcon className="h-5 w-5 text-maroon mx-auto" />
            <h4 className="font-semibold text-maroon">Office Location</h4>
            <p className="text-sm text-black opacity-85">Student Council Office, Block D</p>
          </div>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-4 border border-lightgray p-6 sm:p-8 rounded-lg bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-black mb-1">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-black mb-1">Your Email</label>
              <input
                id="contact-email"
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-black mb-1">Your Message</label>
            <textarea
              id="contact-message"
              required
              rows="4"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-maroon text-white font-medium rounded-md hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
          {contactSubmitted && (
            <div className="p-3 bg-lightgray/20 text-maroon border border-maroon rounded-md text-center text-sm font-semibold">
              Thank you! Your message has been sent successfully. Our team will get back to you shortly.
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default Home;
