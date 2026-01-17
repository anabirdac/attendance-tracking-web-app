/**
 * Events Management Component for Organizer
 * Create, list, and manage events
 */

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventAPI, eventGroupAPI, attendanceAPI, downloadFile } from '../services/api';

export function EventList() {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, groupsRes] = await Promise.all([
        eventAPI.getAll(),
        eventGroupAPI.getAll()
      ]);
      setEvents(eventsRes.data);
      setGroups(groupsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedGroupId
    ? events.filter(e => e.groupId === parseInt(selectedGroupId))
    : events;

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await eventAPI.delete(id);
        await fetchData();
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  return (
    <div>
      <h2>All Events</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Filter by Group</h3>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          style={{ marginBottom: '1rem' }}
        >
          <option value="">All Groups</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No events found. Create one to get started!</p>
          <Link to="/organizer/create-event" className="btn">Create Event</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Group</th>
                <th>State</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td>{event.EventGroup?.name || 'N/A'}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      backgroundColor: event.state === 'OPEN' ? '#28a745' : '#ccc',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}>
                      {event.state}
                    </span>
                  </td>
                  <td>{new Date(event.startTime).toLocaleString()}</td>
                  <td>{new Date(event.endTime).toLocaleString()}</td>
                  <td><code style={{ backgroundColor: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>{event.codeText}</code></td>
                  <td>
                    <Link to={`/organizer/event/${event.id}`} className="btn btn-sm">
                      View
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Event Details Component
 * View attendance and export
 */
export function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const [eventRes, attendanceRes] = await Promise.all([
        eventAPI.getById(eventId),
        attendanceAPI.getEventAttendance(eventId)
      ]);
      setEvent(eventRes.data);
      setAttendance(attendanceRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load event details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await attendanceAPI.exportEventCSV(eventId);
      downloadFile(response.data, `attendance_${eventId}.csv`);
      setError('');
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export CSV: ' + (err.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  const handleExportXLSX = async () => {
    setExporting(true);
    try {
      const response = await attendanceAPI.exportEventXLSX(eventId);
      downloadFile(response.data, `attendance_${eventId}.xlsx`);
      setError('');
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export XLSX: ' + (err.message || 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return <div className="alert alert-danger">Event not found</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/organizer/events" className="btn btn-secondary">
          ← Back to Events
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-warning" onClick={() => alert('Edit functionality coming soon')}>
            ✏️ Edit
          </button>
          <button className="btn btn-danger" onClick={() => alert('Delete functionality coming soon')}>
            🗑️ Delete
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>{event.title}</h2>
        <p className="text-muted">{event.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <strong>State:</strong>
            <p style={{
              display: 'inline-block',
              marginLeft: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              backgroundColor: event.state === 'OPEN' ? '#28a745' : '#ccc',
              color: 'white'
            }}>
              {event.state}
            </p>
          </div>
          <div>
            <strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}
          </div>
          <div>
            <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
          </div>
          <div>
            <strong>Access Code:</strong> <code style={{ backgroundColor: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '1.1rem' }}>{event.codeText}</code>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <strong>QR Code:</strong>
          <img src={event.codeQRUrl} alt="QR Code" style={{ maxWidth: '300px', marginTop: '0.5rem' }} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Export Attendance ({attendance.length} attendees)</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExportCSV} disabled={exporting} className="btn btn-success">
            📊 Export as CSV
          </button>
          <button onClick={handleExportXLSX} disabled={exporting} className="btn btn-success">
            📈 Export as XLSX
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Attendance List ({attendance.length})</h3>
        
        {attendance.length === 0 ? (
          <p className="text-muted">No attendees yet</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Participant Name</th>
                  <th>Email</th>
                  <th>Confirmed At</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id}>
                    <td>{record.Participant.name}</td>
                    <td>{record.Participant.email || '-'}</td>
                    <td>{new Date(record.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
