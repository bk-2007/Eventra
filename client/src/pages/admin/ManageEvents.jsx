import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Plus, Edit2, Trash2, X, Calendar, MapPin, Users } from 'lucide-react';

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null for new event, event object for edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    type: 'Individual',
    date: '',
    venue: '',
    maxParticipants: 50,
    image: '',
  });

  const fetchEvents = async () => {
    try {
      const response = await API.get('/api/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenNewForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'technical',
      type: 'Individual',
      date: '',
      venue: '',
      maxParticipants: 50,
      image: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (event) => {
    setEditingEvent(event);
    
    // Format date string to match inputdatetime-local format: YYYY-MM-DDTHH:MM
    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toISOString().slice(0, 16);

    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      type: event.type,
      date: formattedDate,
      venue: event.venue,
      maxParticipants: event.maxParticipants,
      image: event.image || '',
    });
    setIsFormOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also affect student registrations.')) {
      return;
    }

    try {
      await API.delete(`/api/events/${eventId}`);
      setSuccess('Event deleted successfully.');
      setEvents(events.filter((e) => (e._id || e.id) !== eventId));
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to delete event.');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingEvent) {
        // Edit flow
        const response = await API.put(`/api/events/${editingEvent._id || editingEvent.id}`, formData);
        setSuccess('Event updated successfully!');
        setEvents(events.map((ev) => ((ev._id || ev.id) === editingEvent._id ? response.data : ev)));
      } else {
        // Create flow
        const response = await API.post('/api/events', formData);
        setSuccess('Event created successfully!');
        setEvents([...events, response.data]);
      }
      setIsFormOpen(false);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit event form.');
      console.error(err);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-10 font-display text-maroon">Unauthorized access. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-maroon">Manage Events</h1>
            <p className="text-black opacity-85 mt-1">Add, update, or remove technical and non-technical contests.</p>
          </div>
          <button
            onClick={handleOpenNewForm}
            className="flex items-center space-x-2 px-4 py-2 bg-maroon text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>

        {success && (
          <div className="p-4 bg-lightgray/10 border border-maroon text-maroon font-semibold rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 font-display text-maroon">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="border border-lightgray border-dashed rounded-lg p-12 text-center text-black opacity-60">
            No events found. Click "Create Event" to build your first event.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev._id || ev.id} className="border border-lightgray rounded-lg bg-white overflow-hidden flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="h-40 bg-lightgray overflow-hidden relative">
                  <img
                    src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <span className="px-2 py-0.5 bg-maroon text-white text-[10px] uppercase font-bold rounded">
                      {ev.category}
                    </span>
                    <span className="px-2 py-0.5 bg-black text-white text-[10px] uppercase font-bold rounded">
                      {ev.type}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-grow space-y-3">
                  <h3 className="text-lg font-display font-bold text-maroon line-clamp-1">{ev.title}</h3>
                  <p className="text-black opacity-80 text-xs line-clamp-2">{ev.description}</p>
                  
                  <div className="space-y-1.5 text-xs text-black opacity-70 pt-2 border-t border-lightgray">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-maroon" />
                      <span>{new Date(ev.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-maroon" />
                      <span>{ev.venue}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="h-3.5 w-3.5 text-maroon" />
                      <span>Slots: {ev.maxParticipants} max</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-lightgray bg-lightgray/5 flex justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEditForm(ev)}
                    className="p-1.5 text-black hover:text-maroon border border-lightgray hover:border-maroon rounded transition-colors"
                    title="Edit event"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(ev._id || ev.id)}
                    className="p-1.5 text-black hover:text-maroon border border-lightgray hover:border-maroon rounded transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Dialog Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border border-lightgray rounded-lg w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
            <div className="border-b border-lightgray p-4 flex justify-between items-center bg-white">
              <h3 className="text-lg font-display font-bold text-maroon">
                {editingEvent ? 'Modify Event' : 'Create New Event'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-black hover:text-maroon transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-4">
              <div>
                <label htmlFor="ev-title" className="block text-xs font-semibold text-black">Event Title <span className="text-maroon">*</span></label>
                <input
                  id="ev-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                />
              </div>

              <div>
                <label htmlFor="ev-desc" className="block text-xs font-semibold text-black">Description <span className="text-maroon">*</span></label>
                <textarea
                  id="ev-desc"
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ev-cat" className="block text-xs font-semibold text-black">Category</label>
                  <select
                    id="ev-cat"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black bg-white"
                  >
                    <option value="technical">Technical</option>
                    <option value="non-technical">Non-Technical</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ev-type" className="block text-xs font-semibold text-black">Type</label>
                  <input
                    id="ev-type"
                    type="text"
                    required
                    placeholder="e.g. Individual / Team (2-4)"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ev-date" className="block text-xs font-semibold text-black">Date & Time <span className="text-maroon">*</span></label>
                  <input
                    id="ev-date"
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                  />
                </div>
                <div>
                  <label htmlFor="ev-slots" className="block text-xs font-semibold text-black">Max Participants</label>
                  <input
                    id="ev-slots"
                    type="number"
                    required
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 0 })}
                    className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ev-venue" className="block text-xs font-semibold text-black">Venue <span className="text-maroon">*</span></label>
                <input
                  id="ev-venue"
                  type="text"
                  required
                  placeholder="e.g. Seminar Hall A / Lab 2"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                />
              </div>

              <div>
                <label htmlFor="ev-img" className="block text-xs font-semibold text-black">Banner Image URL</label>
                <input
                  id="ev-img"
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                />
              </div>

              <div className="pt-4 border-t border-lightgray flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-lightgray text-black rounded-md hover:bg-lightgray/10 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-maroon text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
