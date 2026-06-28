import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { technicalEvents } from '../services/mockData';
import RegistrationModal from '../components/RegistrationModal';
import { Calendar, MapPin, Users, CheckCircle, Search } from 'lucide-react';

const TechnicalEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/api/events');
        // Filter only technical events
        const tech = response.data.filter((e) => e.category === 'technical');
        setEvents(tech.length > 0 ? tech : technicalEvents);
      } catch (err) {
        console.log('Error loading events, using mock instead', err);
        setEvents(technicalEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterClick = (event) => {
    if (!user) {
      // Prompt to login
      alert('Please log in or sign up to register for events.');
      navigate('/login', { state: { from: '/events/technical' } });
      return;
    }
    
    if (user.role === 'admin') {
      alert('Administrators cannot register for events.');
      return;
    }

    setSelectedEvent(event);
  };

  const handleRegistrationSuccess = () => {
    setSelectedEvent(null);
    setSuccessMessage('Registration successful! Check details in "My Registrations"');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-maroon">Technical Events</h1>
        <p className="text-black opacity-80 max-w-xl mx-auto">
          Participate in coding sprints, hackathons, and design challenges to test and showcase your technical prowess.
        </p>
      </div>

      {successMessage && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-lightgray/10 border border-maroon text-maroon font-semibold rounded-md flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search bar */}
      <div className="max-w-md mx-auto mb-10 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-maroon" />
        </div>
        <input
          type="text"
          placeholder="Search technical events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 font-display text-maroon">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id || event._id} className="border border-lightgray rounded-lg bg-white overflow-hidden flex flex-col hover:shadow-sm transition-shadow">
              <div className="h-48 bg-lightgray overflow-hidden relative">
                <img
                  src={event.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-3 py-1 bg-maroon text-white text-xs font-semibold rounded-full uppercase">
                  {event.type}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <h3 className="text-xl font-display font-bold text-maroon">{event.title}</h3>
                <p className="text-black opacity-85 text-sm line-clamp-3 flex-grow">{event.description}</p>
                
                <div className="space-y-2 pt-2 border-t border-lightgray text-sm text-black opacity-80">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4.5 w-4.5 text-maroon" />
                    <span>{new Date(event.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4.5 w-4.5 text-maroon" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4.5 w-4.5 text-maroon" />
                    <span>Max Entries: {event.maxParticipants} slots</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRegisterClick(event)}
                  className="mt-4 w-full py-2 bg-maroon text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default TechnicalEvents;
