import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { GraduationCap, LogIn } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);

      // Redirect depending on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/student/registrations' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
        <h2 className="text-3xl font-display font-bold text-maroon">Log In to Your Account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-lightgray rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-black">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-black">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maroon hover:opacity-90 focus:outline-none transition-opacity disabled:opacity-50 space-x-2"
              >
                <LogIn className="h-5 w-5" />
                <span>{loading ? 'Logging In...' : 'Log In'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-lightgray pt-4 text-center">
            <p className="text-sm text-black opacity-80">
              New user?{' '}
              <Link to="/signup" className="font-medium text-maroon hover:underline">
                Register a Student Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
