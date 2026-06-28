import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-maroon text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-white" />
              <span className="font-display font-bold text-lg text-white tracking-tight">Eventra</span>
            </div>
            <p className="text-white opacity-80 text-sm max-w-xs">
              A premium, automated event planning and certificate issuance platform for colleges.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-semibold text-white text-md uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-white opacity-80 hover:opacity-100 transition-opacity">Home</Link>
              </li>
              <li>
                <Link to="/events/technical" className="text-white opacity-80 hover:opacity-100 transition-opacity">Technical Events</Link>
              </li>
              <li>
                <Link to="/events/non-technical" className="text-white opacity-80 hover:opacity-100 transition-opacity">Non-Technical Events</Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-display font-semibold text-white text-md uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-white opacity-80">
              <li>Email: events@college.edu</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: College Campus, University Road, City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} Eventra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
