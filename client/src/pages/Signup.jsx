import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { GraduationCap, UserPlus } from 'lucide-react';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: '',
    year: '1st Year',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Field validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.role === 'student' && (!formData.rollNumber || !formData.branch)) {
      setError('Students must enter Roll Number and Branch');
      setLoading(false);
      return;
    }

    try {
      const response = await API.post('/api/auth/register', formData);
      const { token, user } = response.data;
      login(token, user);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student/registrations');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link to="/" className="inline-flex items-center space-x-2 text-maroon">
          <GraduationCap className="h-10 w-10" />
          <span className="font-display font-bold text-2xl tracking-tight">Eventra</span>
        </Link>
        <h2 className="text-3xl font-display font-bold text-maroon">Create an Account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-lightgray rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-black">
                Full Name <span className="text-maroon">*</span>
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-black">
                Email Address <span className="text-maroon">*</span>
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-black">
                Password <span className="text-maroon">*</span>
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="signup-role" className="block text-sm font-medium text-black">
                Account Role <span className="text-maroon">*</span>
              </label>
              <select
                id="signup-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black bg-white"
              >
                <option value="student">Student</option>
                <option value="admin">Administrator (Faculty/Co-ordinator)</option>
              </select>
            </div>

            {formData.role === 'student' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="signup-roll" className="block text-sm font-medium text-black">
                      Roll Number <span className="text-maroon">*</span>
                    </label>
                    <input
                      id="signup-roll"
                      name="rollNumber"
                      type="text"
                      required
                      placeholder="e.g. CS101"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="signup-branch" className="block text-sm font-medium text-black">
                      Branch <span className="text-maroon">*</span>
                    </label>
                    <input
                      id="signup-branch"
                      name="branch"
                      type="text"
                      required
                      placeholder="e.g. CSE"
                      value={formData.branch}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-year" className="block text-sm font-medium text-black">
                    Year of Study
                  </label>
                  <select
                    id="signup-year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maroon hover:opacity-90 focus:outline-none transition-opacity disabled:opacity-50 space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-lightgray pt-4 text-center">
            <p className="text-sm text-black opacity-80">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-maroon hover:underline">
                Log In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
