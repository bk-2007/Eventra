import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { nonTechnicalEvents } from '../services/mockData';
import RegistrationModal from '../components/RegistrationModal';
import { Calendar, MapPin, Users, CheckCircle, Search, Filter } from 'lucide-react';

const NonTechnicalEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, individual, team
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/api/events');
        // Filter only non-technical events
        const nonTech = response.data.filter((e) => e.category === 'non-technical');
        setEvents(nonTech.length > 0 ? nonTech : nonTechnicalEvents);
      } catch (err) {
        console.log('Error loading events, using mock instead', err);
        setEvents(nonTechnicalEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterClick = (event) => {
    if (!user) {
      alert('Please log in or sign up to register for events.');
      navigate('/login', { state: { from: '/events/non-technical' } });
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

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (typeFilter === 'all') return matchesSearch;
    if (typeFilter === 'individual') {
      return matchesSearch && e.type.toLowerCase().includes('individual');
    }
    if (typeFilter === 'team') {
      return matchesSearch && e.type.toLowerCase().includes('team');
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-maroon">Non-Technical Events</h1>
        <p className="text-black opacity-80 max-w-xl mx-auto">
          Unleash your creativity in debate, treasure hunts, photography challenge, drawing, and stage performances.
        </p>
      </div>

      {successMessage && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-lightgray/10 border border-maroon text-maroon font-semibold rounded-md flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="max-w-3xl mx-auto mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full sm:w-80 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-maroon" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border border-lightgray rounded-md p-1 bg-lightgray/5 w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-grow sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              typeFilter === 'all'
                ? 'bg-maroon text-white'
                : 'text-black hover:text-maroon'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('individual')}
            className={`flex-grow sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              typeFilter === 'individual'
                ? 'bg-maroon text-white'
                : 'text-black hover:text-maroon'
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setTypeFilter('team')}
            className={`flex-grow sm:flex-none px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              typeFilter === 'team'
                ? 'bg-maroon text-white'
                : 'text-black hover:text-maroon'
            }`}
          >
            Team
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 font-display text-maroon">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id || event._id} className="border border-lightgray rounded-lg bg-white overflow-hidden flex flex-col hover:shadow-sm transition-shadow">
              <div className="h-48 bg-lightgray overflow-hidden relative">
                <img
                  src={event.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba'}
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

export default NonTechnicalEvents;
