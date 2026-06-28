import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Search, Download, Check, X, AlertCircle } from 'lucide-react';

const ManageStudents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const eventsResponse = await API.get('/api/events');
        setEvents(eventsResponse.data);
        if (eventsResponse.data.length > 0) {
          setSelectedEventId(eventsResponse.data[0]._id || eventsResponse.data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchRegistrations = async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const response = await API.get('/api/registrations');
      // Filter registrations matching selected event
      const filtered = response.data.filter(
        (reg) => (reg.eventId?._id || reg.eventId?.id || reg.eventId) === selectedEventId
      );
      setRegistrations(filtered);
    } catch (err) {
      setError('Failed to fetch registrations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedEventId]);

  const handleAttendanceChange = async (regId, status) => {
    setUpdatingId(regId);
    try {
      await API.put(`/api/registrations/${regId}/attendance`, { attendanceStatus: status });
      setRegistrations(
        registrations.map((reg) => (reg._id === regId ? { ...reg, attendanceStatus: status } : reg))
      );
      setSuccess('Attendance updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update attendance.');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getEventTitle = () => {
    const ev = events.find((e) => (e._id || e.id) === selectedEventId);
    return ev ? ev.title : 'Event';
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    
    const eventTitle = getEventTitle();
    const csvHeaders = 'Name,Email,Roll Number,Branch,Year,Phone,Registration Type,Team Name,Team Members,Attendance Status\n';
    
    const csvRows = registrations.map((reg) => {
      const name = reg.studentId?.name || '';
      const email = reg.studentId?.email || '';
      const roll = reg.studentId?.rollNumber || '';
      const branch = reg.studentId?.branch || '';
      const year = reg.studentId?.year || '';
      const phone = reg.phone || '';
      const type = reg.isTeam ? 'Team' : 'Individual';
      const teamName = reg.teamName || '';
      
      const teamMembers = reg.isTeam
        ? reg.teamMembers.map((m) => `${m.name} (${m.rollNumber})`).join('; ')
        : '';
        
      const status = reg.attendanceStatus;
      
      return `"${name}","${email}","${roll}","${branch}","${year}","${phone}","${type}","${teamName}","${teamMembers}","${status}"`;
    }).join('\n');

    const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Participants_${eventTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredRegs = registrations.filter((reg) => {
    const student = reg.studentId;
    if (!student) return false;
    const term = searchQuery.toLowerCase();
    
    return (
      student.name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.rollNumber?.toLowerCase().includes(term) ||
      (reg.teamName && reg.teamName.toLowerCase().includes(term))
    );
  });

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-10 font-display text-maroon">Unauthorized access. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-maroon">Manage Students & Attendance</h1>
          <p className="text-black opacity-85 mt-1">Mark attendance and export official participant lists.</p>
        </div>

        {success && (
          <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="p-3 bg-lightgray/10 border border-maroon text-maroon text-sm font-semibold rounded-md">
            {error}
          </div>
        )}

        {/* Filter controls */}
        <div className="border border-lightgray p-4 rounded-lg bg-white grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="student-event-select" className="block text-xs font-semibold text-black mb-1">Select Event</label>
            <select
              id="student-event-select"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black bg-white"
            >
              <option value="">-- Choose Event --</option>
              {events.map((e) => (
                <option key={e._id || e.id} value={e._id || e.id}>
                  {e.title} ({e.category})
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label htmlFor="student-search" className="block text-xs font-semibold text-black mb-1">Search Participant</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-maroon" />
              </div>
              <input
                id="student-search"
                type="text"
                placeholder="Search name, roll, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-lightgray rounded-md focus:outline-none focus:border-maroon text-sm text-black"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={exportCSV}
              disabled={registrations.length === 0}
              className="flex items-center space-x-2 px-4 py-2 border border-maroon text-maroon font-semibold rounded-md hover:bg-lightgray/10 transition-colors disabled:opacity-50 text-sm w-full md:w-auto justify-center"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV List</span>
            </button>
          </div>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="text-center py-10 font-display text-maroon">Loading roster...</div>
        ) : selectedEventId && filteredRegs.length === 0 ? (
          <div className="border border-lightgray border-dashed rounded-lg p-12 text-center text-black opacity-60">
            No registrations found matching the criteria.
          </div>
        ) : (
          <div className="border border-lightgray rounded-lg bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-lightgray text-sm text-left">
                <thead>
                  <tr className="text-black opacity-70 bg-lightgray/5">
                    <th className="py-3 px-4 font-semibold">Registrant (Leader)</th>
                    <th className="py-3 px-4 font-semibold">Roll & Branch</th>
                    <th className="py-3 px-4 font-semibold">Reg Type</th>
                    <th className="py-3 px-4 font-semibold">Contact</th>
                    <th className="py-3 px-4 font-semibold">Attendance Status</th>
                    <th className="py-3 px-4 font-semibold text-center">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lightgray text-black">
                  {filteredRegs.map((reg) => {
                    const student = reg.studentId;
                    if (!student) return null;

                    return (
                      <tr key={reg._id} className="hover:bg-lightgray/5">
                        <td className="py-4 px-4">
                          <p className="font-semibold text-maroon">{student.name}</p>
                          <p className="text-xs text-black opacity-60">{student.email}</p>
                          {reg.isTeam && (
                            <p className="text-xs text-black font-semibold mt-1">
                              Team: {reg.teamName} ({reg.teamMembers?.length + 1} total)
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <p>Roll: {student.rollNumber || 'N/A'}</p>
                          <p className="opacity-80">Branch: {student.branch || 'N/A'} ({student.year || 'N/A'})</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 border rounded text-[10px] uppercase font-bold ${
                            reg.isTeam ? 'border-maroon text-maroon' : 'border-lightgray text-black'
                          }`}>
                            {reg.isTeam ? 'Team' : 'Individual'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-black opacity-80">
                          {reg.phone || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          {reg.attendanceStatus === 'present' && (
                            <span className="text-maroon font-semibold flex items-center space-x-1">
                              <Check className="h-4 w-4" />
                              <span>Present</span>
                            </span>
                          )}
                          {reg.attendanceStatus === 'absent' && (
                            <span className="text-black font-semibold flex items-center space-x-1">
                              <X className="h-4 w-4" />
                              <span>Absent</span>
                            </span>
                          )}
                          {reg.attendanceStatus === 'pending' && (
                            <span className="text-black opacity-60 flex items-center space-x-1">
                              <AlertCircle className="h-4 w-4 animate-pulse" />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleAttendanceChange(reg._id, 'present')}
                              disabled={updatingId === reg._id}
                              className={`p-1 border rounded transition-colors ${
                                reg.attendanceStatus === 'present'
                                  ? 'bg-maroon text-white border-maroon'
                                  : 'border-lightgray hover:border-maroon text-black hover:text-maroon'
                              }`}
                              title="Mark Present"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(reg._id, 'absent')}
                              disabled={updatingId === reg._id}
                              className={`p-1 border rounded transition-colors ${
                                reg.attendanceStatus === 'absent'
                                  ? 'bg-black text-white border-black'
                                  : 'border-lightgray hover:border-black text-black hover:text-black'
                              }`}
                              title="Mark Absent"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;
