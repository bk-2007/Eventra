import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Calendar, MapPin, CheckCircle2, XCircle, AlertCircle, Users } from 'lucide-react';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await API.get('/api/registrations');
        setRegistrations(response.data);
      } catch (err) {
        setError('Failed to fetch registrations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white border border-maroon text-maroon text-xs font-semibold rounded-full uppercase">
            <CheckCircle2 className="h-3 w-3" />
            <span>Present</span>
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white border border-black text-black text-xs font-semibold rounded-full uppercase">
            <XCircle className="h-3 w-3" />
            <span>Absent</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white border border-lightgray text-black opacity-80 text-xs font-semibold rounded-full uppercase">
            <AlertCircle className="h-3 w-3 animate-pulse" />
            <span>Pending</span>
          </span>
        );
    }
  };

  if (!user) {
    return <div className="text-center py-10 font-display text-maroon">Please log in to view registrations.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 bg-white min-h-screen">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-maroon">My Registrations</h1>
          <p className="text-black opacity-80 mt-1">Check your registered events, team list, and attendance verification status.</p>
        </div>

        {error && (
          <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 font-display text-maroon">Loading registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="border border-lightgray border-dashed rounded-lg p-12 text-center space-y-4">
            <Calendar className="h-12 w-12 text-maroon mx-auto opacity-40" />
            <p className="text-black opacity-80 font-medium">You haven't registered for any events yet.</p>
            <p className="text-xs text-black opacity-60">Go to the Technical or Non-Technical event pages to get registered!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg) => {
              const event = reg.eventId;
              if (!event) return null;

              return (
                <div key={reg._id} className="border border-lightgray rounded-lg bg-white p-6 hover:shadow-sm transition-shadow flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-lightgray pb-3 gap-2">
                    <div>
                      <span className="px-2 py-0.5 border border-maroon/20 text-maroon text-[10px] uppercase font-bold rounded">
                        {event.category}
                      </span>
                      <h3 className="text-xl font-display font-bold text-maroon mt-1.5">{event.title}</h3>
                    </div>
                    <div>
                      {getStatusBadge(reg.attendanceStatus)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black opacity-80">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4.5 w-4.5 text-maroon" />
                      <span>{new Date(event.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4.5 w-4.5 text-maroon" />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  {/* Team Registration details */}
                  {reg.isTeam && (
                    <div className="bg-lightgray/5 border border-lightgray rounded p-4 space-y-3">
                      <div className="flex items-center space-x-2 border-b border-lightgray pb-1">
                        <Users className="h-4 w-4 text-maroon" />
                        <span className="text-sm font-semibold text-maroon">Team Registration</span>
                      </div>
                      <div className="text-xs space-y-2 text-black opacity-85">
                        <p><strong>Team Name:</strong> {reg.teamName}</p>
                        <div>
                          <strong>Members:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1 pl-1">
                            {reg.teamMembers?.map((m, idx) => (
                              <li key={idx}>
                                {m.name} ({m.rollNumber} - {m.branch}, {m.year})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-black opacity-60 text-right">
                    Registered on: {new Date(reg.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
