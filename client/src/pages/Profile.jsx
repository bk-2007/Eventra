import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User, CheckCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [year, setYear] = useState(user?.year || '1st Year');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await API.put('/api/auth/profile', {
        name,
        ...(user.role === 'student' ? { rollNumber, branch, year } : {})
      });
      
      updateProfile(response.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-10 font-display text-maroon">Please log in to view profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 bg-white min-h-screen">
      <div className="border border-lightgray rounded-lg p-6 sm:p-8 bg-white space-y-6">
        <div className="flex items-center space-x-3 border-b border-lightgray pb-4">
          <div className="p-3 bg-lightgray/10 text-maroon rounded-full">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-maroon">My Profile</h2>
            <p className="text-xs text-black opacity-80">View and update your account details</p>
          </div>
        </div>

        {success && (
          <div className="p-4 bg-lightgray/10 border border-maroon text-maroon font-semibold rounded-md flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-black">Email Address</label>
            <input
              id="profile-email"
              type="email"
              disabled
              value={user.email}
              className="mt-1 w-full px-3 py-2 border border-lightgray bg-lightgray/20 rounded-md text-sm text-black cursor-not-allowed"
            />
            <p className="text-[10px] text-black opacity-60 mt-1">Email address cannot be changed.</p>
          </div>

          <div>
            <label htmlFor="profile-role" className="block text-sm font-medium text-black">Account Role</label>
            <input
              id="profile-role"
              type="text"
              disabled
              value={user.role === 'admin' ? 'Administrator' : 'Student'}
              className="mt-1 w-full px-3 py-2 border border-lightgray bg-lightgray/20 rounded-md text-sm text-black cursor-not-allowed uppercase font-bold"
            />
          </div>

          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-black">Full Name</label>
            <input
              id="profile-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
            />
          </div>

          {user.role === 'student' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profile-roll" className="block text-sm font-medium text-black">Roll Number</label>
                  <input
                    id="profile-roll"
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                  />
                </div>
                <div>
                  <label htmlFor="profile-branch" className="block text-sm font-medium text-black">Branch</label>
                  <input
                    id="profile-branch"
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="profile-year" className="block text-sm font-medium text-black">Year of Study</label>
                <select
                  id="profile-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black bg-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-lightgray">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maroon hover:opacity-90 focus:outline-none transition-opacity disabled:opacity-50 space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Save Profile Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
