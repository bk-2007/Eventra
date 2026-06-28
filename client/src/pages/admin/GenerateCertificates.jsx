import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Award, CheckSquare, Square, CheckCircle, RefreshCw } from 'lucide-react';

const GenerateCertificates = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [presentStudents, setPresentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [certTypes, setCertTypes] = useState({}); // regId -> 'participant' | 'merit'
  const [positions, setPositions] = useState({});   // regId -> string (e.g. '1st Place')
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/api/events');
        setEvents(response.data);
        if (response.data.length > 0) {
          setSelectedEventId(response.data[0]._id || response.data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const fetchEligibleStudents = async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const response = await API.get('/api/registrations');
      // Filter present students for the current event
      const eligible = response.data.filter(
        (reg) => 
          (reg.eventId?._id || reg.eventId?.id || reg.eventId) === selectedEventId && 
          reg.attendanceStatus === 'present'
      );
      
      setPresentStudents(eligible);
      setSelectedIds([]);
      
      // Initialize default type and position mappings
      const initialTypes = {};
      const initialPositions = {};
      eligible.forEach((reg) => {
        initialTypes[reg._id] = 'participant';
        initialPositions[reg._id] = '';
      });
      setCertTypes(initialTypes);
      setPositions(initialPositions);
    } catch (err) {
      setError('Failed to fetch eligible students.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibleStudents();
  }, [selectedEventId]);

  const toggleSelect = (regId) => {
    if (selectedIds.includes(regId)) {
      setSelectedIds(selectedIds.filter((id) => id !== regId));
    } else {
      setSelectedIds([...selectedIds, regId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === presentStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(presentStudents.map((reg) => reg._id));
    }
  };

  const handleTypeChange = (regId, type) => {
    setCertTypes({ ...certTypes, [regId]: type });
  };

  const handlePositionChange = (regId, pos) => {
    setPositions({ ...positions, [regId]: pos });
  };

  const handleBulkGenerate = async () => {
    if (selectedIds.length === 0) return;
    
    setGenerating(true);
    setError('');
    setSuccess('');

    let successCount = 0;
    let failedCount = 0;

    // Run generations in parallel/sequence
    for (const regId of selectedIds) {
      const reg = presentStudents.find((r) => r._id === regId);
      if (!reg) continue;

      try {
        await API.post('/api/certificate/generate', {
          studentId: reg.studentId?._id || reg.studentId?.id || reg.studentId,
          eventId: selectedEventId,
          certificateType: certTypes[regId],
          position: certTypes[regId] === 'merit' ? positions[regId] : undefined,
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to generate cert for ${reg.studentId?.name}`, err);
        failedCount++;
      }
    }

    setGenerating(false);
    if (successCount > 0) {
      setSuccess(`Successfully generated ${successCount} certificate(s).` + (failedCount > 0 ? ` Failed: ${failedCount}.` : ''));
      fetchEligibleStudents(); // Reload
    } else {
      setError(`Failed to generate certificates. Check server logs.`);
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-10 font-display text-maroon">Unauthorized access. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-maroon">Generate Certificates</h1>
          <p className="text-black opacity-85 mt-1">Bulk-issue participation and merit certificates for students marked present.</p>
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

        {/* Filter Selection */}
        <div className="border border-lightgray p-4 rounded-lg bg-white flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="w-full md:w-80">
            <label htmlFor="cert-event-select" className="block text-xs font-semibold text-black mb-1">Select Event</label>
            <select
              id="cert-event-select"
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

          <div>
            <button
              onClick={handleBulkGenerate}
              disabled={selectedIds.length === 0 || generating}
              className="flex items-center space-x-2 px-6 py-2 bg-maroon text-white font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm justify-center w-full md:w-auto"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating PDFs...</span>
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  <span>Bulk Generate ({selectedIds.length} Selected)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="text-center py-10 font-display text-maroon">Loading attendees...</div>
        ) : presentStudents.length === 0 ? (
          <div className="border border-lightgray border-dashed rounded-lg p-12 text-center text-black opacity-60">
            No students found marked as present for this event. 
            <p className="text-xs opacity-80 mt-1">Please mark student attendance first in the "Students" tab.</p>
          </div>
        ) : (
          <div className="border border-lightgray rounded-lg bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-lightgray text-sm text-left">
                <thead>
                  <tr className="text-black opacity-70 bg-lightgray/5">
                    <th className="py-3 px-4 font-semibold w-12 text-center">
                      <button onClick={toggleSelectAll} className="text-maroon">
                        {selectedIds.length === presentStudents.length ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 font-semibold">Student Details</th>
                    <th className="py-3 px-4 font-semibold">Roll & Branch</th>
                    <th className="py-3 px-4 font-semibold">Certificate Type</th>
                    <th className="py-3 px-4 font-semibold">Merit Position</th>
                    <th className="py-3 px-4 font-semibold">Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lightgray text-black">
                  {presentStudents.map((reg) => {
                    const student = reg.studentId;
                    if (!student) return null;

                    const isChecked = selectedIds.includes(reg._id);
                    const isGenerated = reg.certificateGenerated;

                    return (
                      <tr key={reg._id} className="hover:bg-lightgray/5">
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => toggleSelect(reg._id)}
                            disabled={isGenerated}
                            className="text-maroon disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {isChecked || isGenerated ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          <p>{student.name}</p>
                          <p className="text-xs text-black opacity-60 font-normal">{student.email}</p>
                        </td>
                        <td className="py-4 px-4 text-xs text-black opacity-80">
                          <p>Roll: {student.rollNumber || 'N/A'}</p>
                          <p>Branch: {student.branch || 'N/A'} ({student.year || 'N/A'})</p>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            disabled={isGenerated || !isChecked}
                            value={certTypes[reg._id]}
                            onChange={(e) => handleTypeChange(reg._id, e.target.value)}
                            className="px-2 py-1 border border-lightgray rounded text-xs text-black bg-white focus:outline-none focus:border-maroon disabled:opacity-50"
                          >
                            <option value="participant">Participation</option>
                            <option value="merit">Merit</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <input
                            type="text"
                            disabled={isGenerated || !isChecked || certTypes[reg._id] !== 'merit'}
                            placeholder="e.g. 1st Place, Runner-up"
                            value={positions[reg._id]}
                            onChange={(e) => handlePositionChange(reg._id, e.target.value)}
                            className="px-2 py-1 border border-lightgray rounded text-xs text-black focus:outline-none focus:border-maroon w-40 disabled:opacity-50"
                          />
                        </td>
                        <td className="py-4 px-4">
                          {isGenerated ? (
                            <span className="text-maroon font-semibold flex items-center space-x-1 text-xs">
                              <CheckCircle className="h-4 w-4" />
                              <span>Yes</span>
                            </span>
                          ) : (
                            <span className="text-black opacity-60 text-xs">No</span>
                          )}
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

export default GenerateCertificates;
