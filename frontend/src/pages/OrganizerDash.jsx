/**
 * Organizer Dashboard Component
 * Main dashboard for event organizers
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { eventGroupAPI, eventAPI, attendanceAPI, downloadFile } from '../services/api';
import { EventList, EventDetail } from '../components/EventManagement';
import CreateEventPage from './CreateEventPage';

// Create Event Button Component
function CreateEventButton() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate('/organizer/create-event')}
      className="btn"
      style={{ marginBottom: '1.5rem' }}
    >
      + Create New Event
    </button>
  );
}

// Event Groups Management Component
function EventGroupsManagement() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', startDate: '', endDate: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await eventGroupAPI.getAll();
      // Handle both array and wrapped response
      const groupData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setGroups(groupData);
      setError('');
    } catch (err) {
      setError('Failed to load event groups');
      console.error(err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      await eventGroupAPI.create(newGroup);
      setNewGroup({ name: '', description: '', startDate: '', endDate: '' });
      await fetchGroups();
      setError('');
    } catch (err) {
      setError('Failed to create event group: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await eventGroupAPI.delete(id);
        await fetchGroups();
      } catch (err) {
        setError('Failed to delete group: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div>
      <h2>Event Groups</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleCreateGroup} className="card" style={{ marginBottom: '2rem' }}>
        <h3>Create New Event Group</h3>
        <div className="form-group">
          <label>Group Name *</label>
          <input
            type="text"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            placeholder="e.g., Tech Conference 2026"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
            placeholder="Brief description of the group"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={newGroup.startDate}
              onChange={(e) => setNewGroup({ ...newGroup, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={newGroup.endDate}
              onChange={(e) => setNewGroup({ ...newGroup, endDate: e.target.value })}
            />
          </div>
        </div>
        <button type="submit">Create Event Group</button>
      </form>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading event groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No event groups yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid">
          {groups.map((group) => (
            <div className="card" key={group.id}>
              <h3>{group.name}</h3>
              <p className="text-muted" style={{ marginBottom: '1rem' }}>{group.description}</p>
              <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                {group.startDate && <p>📅 {new Date(group.startDate).toLocaleDateString()}</p>}
              </div>
              <div className="card-footer">
                <Link to={`/organizer/group/${group.id}`} className="btn btn-sm">
                  View Details
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Organizer Dashboard Component
export default function OrganizerDash() {
  return (
    <Routes>
      <Route path="/dashboard" element={
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1>Event Organizer Dashboard</h1>
            <Link to="/" className="btn btn-secondary">Back Home</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3>📋 Event Groups</h3>
              <p style={{ fontSize: '2rem', color: '#007bff', margin: '1rem 0' }}>Manage your events</p>
              <Link to="/organizer/groups" className="btn" style={{ width: '100%' }}>
                Go to Groups
              </Link>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3>🎯 Events</h3>
              <p style={{ fontSize: '2rem', color: '#007bff', margin: '1rem 0' }}>Create and manage events</p>
              <Link to="/organizer/events" className="btn" style={{ width: '100%' }}>
                Go to Events
              </Link>
            </div>
          </div>

          <div className="card">
            <h2>Quick Start Guide</h2>
            <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Create an <strong>Event Group</strong> to organize your events</li>
              <li>Add <strong>Events</strong> to the group with date, time, and duration</li>
              <li>Share the <strong>QR code or access code</strong> with participants</li>
              <li>Monitor <strong>attendance</strong> in real-time</li>
              <li><strong>Export</strong> attendance records when needed</li>
            </ol>
          </div>
        </div>
      } />
      <Route path="/groups" element={
        <div className="container">
          <Link to="/organizer/dashboard" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
            ← Back to Dashboard
          </Link>
          <EventGroupsManagement />
        </div>
      } />
      <Route path="/events" element={
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <Link to="/organizer/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </Link>
            </div>
            <CreateEventButton />
          </div>
          <EventList />
        </div>
      } />
      <Route path="/event/:eventId" element={
        <div className="container">
          <EventDetail />
        </div>
      } />
      <Route path="/create-event" element={
        <CreateEventPage />
      } />
      <Route path="*" element={
        <div className="container">
          <h2>Organizer Section</h2>
          <p>Welcome to the Event Organizer Dashboard. Choose an option above to get started.</p>
          <Link to="/organizer/dashboard" className="btn">Go to Dashboard</Link>
        </div>
      } />
    </Routes>
  );
}
