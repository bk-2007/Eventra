import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, GraduationCap, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-maroon border-b-2 border-maroon'
        : 'text-black hover:text-maroon hover:border-b-2 hover:border-maroon'
    }`;
  };

  const mobileLinkClass = (path) => {
    return `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive(path)
        ? 'text-maroon bg-lightgray/10'
        : 'text-black hover:text-maroon hover:bg-lightgray/10'
    }`;
  };

  return (
    <nav className="bg-white border-b border-lightgray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-maroon" />
              <span className="font-display font-bold text-xl text-maroon tracking-tight">Eventra</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/events/technical" className={linkClass('/events/technical')}>Technical</Link>
            <Link to="/events/non-technical" className={linkClass('/events/non-technical')}>Non-Technical</Link>
            <Link to="/about" className={linkClass('/about')}>About</Link>
            <Link to="/contact" className={linkClass('/contact')}>Contact</Link>

            {/* Role based links */}
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" className={linkClass('/admin')}>Dashboard</Link>
                    <Link to="/admin/events" className={linkClass('/admin/events')}>Manage Events</Link>
                    <Link to="/admin/students" className={linkClass('/admin/students')}>Students</Link>
                    <Link to="/admin/certificates" className={linkClass('/admin/certificates')}>Certificates</Link>
                  </>
                ) : (
                  <>
                    <Link to="/student/registrations" className={linkClass('/student/registrations')}>My Registrations</Link>
                    <Link to="/student/certificates" className={linkClass('/student/certificates')}>My Certificates</Link>
                    <Link to="/student/profile" className={linkClass('/student/profile')}>Profile</Link>
                  </>
                )}
                
                <div className="flex items-center pl-2 border-l border-lightgray ml-2 space-x-2">
                  <div className="flex items-center text-sm font-medium text-black">
                    <UserIcon className="h-4 w-4 text-maroon mr-1" />
                    <span>{user.name.split(' ')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded-md text-black hover:text-maroon transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-lightgray ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-maroon hover:opacity-80 transition-opacity"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-maroon text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-maroon focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-lightgray bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass('/')}>Home</Link>
            <Link to="/events/technical" onClick={() => setIsOpen(false)} className={mobileLinkClass('/events/technical')}>Technical</Link>
            <Link to="/events/non-technical" onClick={() => setIsOpen(false)} className={mobileLinkClass('/events/non-technical')}>Non-Technical</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className={mobileLinkClass('/about')}>About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className={mobileLinkClass('/contact')}>Contact</Link>

            {user ? (
              <>
                <div className="border-t border-lightgray my-2"></div>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin')}>Dashboard</Link>
                    <Link to="/admin/events" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/events')}>Manage Events</Link>
                    <Link to="/admin/students" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/students')}>Students</Link>
                    <Link to="/admin/certificates" onClick={() => setIsOpen(false)} className={mobileLinkClass('/admin/certificates')}>Certificates</Link>
                  </>
                ) : (
                  <>
                    <Link to="/student/registrations" onClick={() => setIsOpen(false)} className={mobileLinkClass('/student/registrations')}>My Registrations</Link>
                    <Link to="/student/certificates" onClick={() => setIsOpen(false)} className={mobileLinkClass('/student/certificates')}>My Certificates</Link>
                    <Link to="/student/profile" onClick={() => setIsOpen(false)} className={mobileLinkClass('/student/profile')}>Profile</Link>
                  </>
                )}
                <div className="border-t border-lightgray my-2"></div>
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-black flex items-center">
                    <UserIcon className="h-4 w-4 text-maroon mr-1" />
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1 bg-maroon text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-lightgray my-2"></div>
                <div className="grid grid-cols-2 gap-2 px-3 py-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-2 border border-maroon rounded-md text-sm font-medium text-maroon hover:opacity-80 transition-opacity"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-4 py-2 bg-maroon rounded-md text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
