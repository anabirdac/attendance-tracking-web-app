/**
 * Create Event Page Component
 * Form for creating new events within a group
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventAPI, eventGroupAPI } from '../services/api';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [formData, setFormData] = useState({
    groupId: groupId || '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 60 // minutes
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await eventGroupAPI.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to load groups:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update state
    const newFormData = {
      ...formData,
      [name]: value
    };

    // Helper function to convert datetime-local string to Date object
    const parseLocalDateTime = (dateTimeString) => {
      const parts = dateTimeString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (!parts) return new Date(dateTimeString);
      const [, year, month, day, hours, minutes] = parts;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    };

    // Helper function to format Date back to datetime-local format
    const formatLocalDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Auto-calculate end time based on start time and duration
    if (name === 'startTime') {
      if (newFormData.duration) {
        const start = parseLocalDateTime(value);
        const end = new Date(start.getTime() + parseInt(newFormData.duration) * 60000);
        newFormData.endTime = formatLocalDateTime(end);
      }
    } else if (name === 'duration') {
      if (newFormData.startTime) {
        const start = parseLocalDateTime(newFormData.startTime);
        const end = new Date(start.getTime() + parseInt(value) * 60000);
        newFormData.endTime = formatLocalDateTime(end);
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!formData.startTime) {
      setError('Start time is required');
      return;
    }

    if (!formData.endTime) {
      setError('End time is required');
      return;
    }

    // Helper function to convert datetime-local string to ISO string
    const parseLocalDateTime = (dateTimeString) => {
      const parts = dateTimeString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (!parts) return new Date(dateTimeString);
      const [, year, month, day, hours, minutes] = parts;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
      return date.toISOString();
    };

    const startDate = new Date(parseLocalDateTime(formData.startTime));
    const endDate = new Date(parseLocalDateTime(formData.endTime));

    if (endDate <= startDate) {
      setError('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        groupId: formData.groupId ? parseInt(formData.groupId) : null,
        title: formData.title,
        description: formData.description,
        startTime: parseLocalDateTime(formData.startTime),
        endTime: parseLocalDateTime(formData.endTime)
      };

      await eventAPI.create(eventData);
      setError('');
      // Navigate to events list
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1000);
    } catch (err) {
      setError('Failed to create event: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h2>Create New Event</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Event Group</label>
          <select
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
          >
            <option value="">No Group (Standalone Event)</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <small style={{ color: '#666' }}>Optional - select a group or leave blank</small>
        </div>

        <div className="form-group">
          <label>Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Opening Keynote"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the event"
            disabled={loading}
            style={{ minHeight: '100px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              step="1"
              disabled={loading}
            />
            <small style={{ color: '#666' }}>End time auto-calculated</small>
          </div>
        </div>

        <div className="form-group">
          <label>End Date & Time *</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/organizer/events')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f9f9f9' }}>
        <h3>💡 Tips</h3>
        <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Event code is <strong>auto-generated</strong> - unique for each event</li>
          <li>Event starts in <strong>CLOSED</strong> state</li>
          <li>Automatically opens at <strong>start time</strong></li>
          <li>Automatically closes after <strong>end time</strong></li>
          <li>Participants can confirm attendance while event is <strong>OPEN</strong></li>
          <li>A <strong>QR code</strong> is generated automatically</li>
        </ul>
      </div>
    </div>
  );
}
