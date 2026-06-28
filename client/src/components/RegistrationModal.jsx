import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { X, Plus, Trash2 } from 'lucide-react';

const RegistrationModal = ({ event, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isTeam, setIsTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [phone, setPhone] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Individual info from user context
  const [formData, setFormData] = useState({
    name: user?.name || '',
    rollNumber: user?.rollNumber || '',
    branch: user?.branch || '',
    year: user?.year || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        rollNumber: user.rollNumber || '',
        branch: user.branch || '',
        year: user.year || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      { name: '', rollNumber: '', branch: '', year: '1st Year', email: '', phone: '' }
    ]);
  };

  const removeTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!phone) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    if (isTeam && !teamName) {
      setError('Team name is required for team registrations');
      setLoading(false);
      return;
    }

    if (isTeam && teamMembers.length === 0) {
      setError('Please add at least one team member');
      setLoading(false);
      return;
    }

    // Check if any team member field is empty
    if (isTeam) {
      for (let i = 0; i < teamMembers.length; i++) {
        const m = teamMembers[i];
        if (!m.name || !m.rollNumber || !m.branch || !m.email || !m.phone) {
          setError(`Please fill all fields for Team Member ${i + 1}`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const payload = {
        eventId: event._id || event.id,
        isTeam,
        phone,
        ...(isTeam ? { teamName, teamMembers } : {})
      };

      await API.post('/api/register', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. You might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white border border-lightgray rounded-lg w-full max-w-2xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-lightgray p-4 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-xl font-display font-bold text-maroon">Register for {event.title}</h3>
            <p className="text-xs text-black opacity-80 mt-0.5">Type: {event.type} | Venue: {event.venue}</p>
          </div>
          <button onClick={onClose} className="text-black hover:text-maroon transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-6">
          {error && (
            <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
              {error}
            </div>
          )}

          {/* Registration Type Select */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Registration Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsTeam(false)}
                className={`py-3 px-4 border rounded-md font-medium text-sm text-center transition-all ${
                  !isTeam
                    ? 'border-maroon text-maroon bg-lightgray/5'
                    : 'border-lightgray text-black hover:border-maroon/50'
                }`}
              >
                Individual Registration
              </button>
              <button
                type="button"
                onClick={() => setIsTeam(true)}
                className={`py-3 px-4 border rounded-md font-medium text-sm text-center transition-all ${
                  isTeam
                    ? 'border-maroon text-maroon bg-lightgray/5'
                    : 'border-lightgray text-black hover:border-maroon/50'
                }`}
              >
                Team Registration
              </button>
            </div>
          </div>

          {/* Basic Student Information (Pre-populated) */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-md text-maroon border-b border-lightgray pb-1">
              Leader / Registrant Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">Student Name</label>
                <input
                  type="text"
                  disabled
                  value={formData.name}
                  className="w-full px-3 py-2 border border-lightgray bg-lightgray/20 rounded-md text-sm text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">Roll Number</label>
                <input
                  type="text"
                  disabled
                  value={formData.rollNumber}
                  className="w-full px-3 py-2 border border-lightgray bg-lightgray/20 rounded-md text-sm text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">Branch</label>
                <input
                  type="text"
                  disabled
                  value={formData.branch}
                  className="w-full px-3 py-2 border border-lightgray bg-lightgray/20 rounded-md text-sm text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">Year</label>
                <input
                  type="text"
                  disabled
                  value={formData.year}
                  className="w-full px-3 py-2 border border-lightgray bg-lightgray/20 rounded-md text-sm text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-3 py-2 border border-lightgray bg-lightgray/20 rounded-md text-sm text-black"
                />
              </div>
              <div>
                <label htmlFor="modal-phone" className="block text-xs font-medium text-black mb-1">
                  Phone Number <span className="text-maroon">*</span>
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-lightgray rounded-md text-sm text-black focus:outline-none focus:border-maroon"
                />
              </div>
            </div>
          </div>

          {/* Team Registration Specifics */}
          {isTeam && (
            <div className="space-y-4 pt-2">
              <h4 className="font-display font-semibold text-md text-maroon border-b border-lightgray pb-1 flex justify-between items-center">
                <span>Team Details</span>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="inline-flex items-center space-x-1 text-xs px-2 py-1 bg-maroon text-white rounded hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Member</span>
                </button>
              </h4>

              <div>
                <label htmlFor="modal-team-name" className="block text-xs font-medium text-black mb-1">
                  Team Name <span className="text-maroon">*</span>
                </label>
                <input
                  id="modal-team-name"
                  type="text"
                  required
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2 border border-lightgray rounded-md text-sm text-black focus:outline-none focus:border-maroon"
                />
              </div>

              {teamMembers.map((member, index) => (
                <div key={index} className="border border-lightgray rounded-md p-4 space-y-4 bg-lightgray/5 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-maroon">Team Member {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-black hover:text-maroon transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-black mb-0.5">Name</label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 border border-lightgray rounded text-xs text-black bg-white focus:outline-none focus:border-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-black mb-0.5">Roll Number</label>
                      <input
                        type="text"
                        required
                        value={member.rollNumber}
                        onChange={(e) => handleMemberChange(index, 'rollNumber', e.target.value)}
                        className="w-full px-2 py-1.5 border border-lightgray rounded text-xs text-black bg-white focus:outline-none focus:border-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-black mb-0.5">Branch</label>
                      <input
                        type="text"
                        required
                        value={member.branch}
                        onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                        className="w-full px-2 py-1.5 border border-lightgray rounded text-xs text-black bg-white focus:outline-none focus:border-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-black mb-0.5">Year</label>
                      <select
                        value={member.year}
                        onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                        className="w-full px-2 py-1.5 border border-lightgray rounded text-xs text-black bg-white focus:outline-none focus:border-maroon"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-black mb-0.5">Email</label>
                      <input
                        type="email"
                        required
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        className="w-full px-2 py-1.5 border border-lightgray rounded text-xs text-black bg-white focus:outline-none focus:border-maroon"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-black mb-0.5">Phone</label>
                      <input
                        type="tel"
                        required
                        value={member.phone}
                        onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                        className="w-full px-2 py-1.5 border border-lightgray rounded text-xs text-black bg-white focus:outline-none focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer inside form */}
          <div className="pt-4 border-t border-lightgray flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-lightgray text-black rounded-md hover:bg-lightgray/10 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-maroon text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
