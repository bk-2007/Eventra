import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Calendar, Users, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    popularEventName: 'N/A',
    popularEventCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const eventsResponse = await API.get('/api/events');
        const registrationsResponse = await API.get('/api/registrations');

        const events = eventsResponse.data;
        const registrations = registrationsResponse.data;

        // Group registrations by event to find the most popular event
        const regCounts = {};
        registrations.forEach((reg) => {
          const eventId = reg.eventId?._id || reg.eventId?.id || reg.eventId;
          if (eventId) {
            regCounts[eventId] = (regCounts[eventId] || 0) + 1;
          }
        });

        let popularEventId = '';
        let maxCount = 0;
        Object.entries(regCounts).forEach(([evId, count]) => {
          if (count > maxCount) {
            maxCount = count;
            popularEventId = evId;
          }
        });

        const popularEvent = events.find((e) => (e._id || e.id) === popularEventId);

        setStats({
          totalEvents: events.length,
          totalRegistrations: registrations.length,
          popularEventName: popularEvent ? popularEvent.title : 'None',
          popularEventCount: maxCount,
        });

        // Get 5 most recent registrations
        const sortedRegs = [...registrations]
          .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
          .slice(0, 5);
        setRecentRegistrations(sortedRegs);
      } catch (err) {
        setError('Failed to compute dashboard stats.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-10 font-display text-maroon">Unauthorized access. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-maroon">Admin Dashboard</h1>
          <p className="text-black opacity-85 mt-1">Real-time stats, registration counts, and event monitoring.</p>
        </div>

        {error && (
          <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 font-display text-maroon">Loading analytics...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-lightgray rounded-lg p-6 bg-white flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-black opacity-60">Total Events</p>
                  <h3 className="text-3xl font-display font-bold text-maroon">{stats.totalEvents}</h3>
                  <Link to="/admin/events" className="text-xs text-maroon hover:underline font-semibold block">Manage Events &rarr;</Link>
                </div>
                <div className="p-3 bg-lightgray/10 text-maroon rounded-full">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>

              <div className="border border-lightgray rounded-lg p-6 bg-white flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-black opacity-60">Total Registrations</p>
                  <h3 className="text-3xl font-display font-bold text-maroon">{stats.totalRegistrations}</h3>
                  <Link to="/admin/students" className="text-xs text-maroon hover:underline font-semibold block">View Students &rarr;</Link>
                </div>
                <div className="p-3 bg-lightgray/10 text-maroon rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>

              <div className="border border-lightgray rounded-lg p-6 bg-white flex items-center justify-between">
                <div className="space-y-2 max-w-[70%]">
                  <p className="text-sm font-medium text-black opacity-60">Most Popular Event</p>
                  <h3 className="text-xl font-display font-bold text-maroon truncate" title={stats.popularEventName}>
                    {stats.popularEventName}
                  </h3>
                  <p className="text-xs text-black opacity-75 font-semibold">
                    {stats.popularEventCount} Registrations
                  </p>
                </div>
                <div className="p-3 bg-lightgray/10 text-maroon rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="border border-lightgray rounded-lg p-6 bg-white space-y-4">
              <h3 className="font-display font-bold text-xl text-maroon">Recent Registrations</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-lightgray text-sm text-left">
                  <thead>
                    <tr className="text-black opacity-70">
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Roll Number</th>
                      <th className="py-3 px-4 font-semibold">Event Registered</th>
                      <th className="py-3 px-4 font-semibold">Reg Type</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-lightgray text-black">
                    {recentRegistrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-lightgray/5">
                        <td className="py-3 px-4 font-medium">{reg.studentId?.name || 'N/A'}</td>
                        <td className="py-3 px-4">{reg.studentId?.rollNumber || 'N/A'}</td>
                        <td className="py-3 px-4 font-semibold text-maroon">{reg.eventId?.title || 'Deleted Event'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 border border-lightgray rounded text-xs">
                            {reg.isTeam ? 'Team' : 'Individual'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(reg.registrationDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {recentRegistrations.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-black opacity-60">No registrations recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
