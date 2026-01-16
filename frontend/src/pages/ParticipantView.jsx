/**
 * Participant View Component
 * Allows participants to confirm attendance using QR codes or text codes
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { attendanceAPI } from '../services/api';
import { QRScanner } from '../components/QRScanner';

export default function ParticipantView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [useQR, setUseQR] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleConfirmAttendance = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ type: 'danger', text: 'Please enter your name' });
      return;
    }

    if (!code.trim()) {
      setMessage({ type: 'danger', text: 'Please enter or scan an event code' });
      return;
    }

    setLoading(true);
    try {
      await attendanceAPI.confirm({
        name: name.trim(),
        email: email.trim() || null,
        code: code.trim()
      });

      setMessage({
        type: 'success',
        text: '✓ Your attendance has been confirmed successfully!'
      });

      // Reset form
      setTimeout(() => {
        setName('');
        setEmail('');
        setCode('');
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setMessage({
        type: 'danger',
        text: '✗ Error: ' + errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Confirm Your Attendance</h1>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          ← Back Home
        </Link>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
          {message.text}
        </div>
      )}

      <div className="card">
        {!useQR ? (
          <form onSubmit={handleConfirmAttendance}>
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Event Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter the 6-character event code"
                maxLength="6"
                style={{ textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '0.5rem' }}
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
              {loading ? 'Confirming...' : 'Confirm Attendance'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setUseQR(true)}
              disabled={loading}
              style={{ width: '100%' }}
            >
              Scan QR Code Instead
            </button>
          </form>
        ) : (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Scan Event QR Code</h3>
            <QRScanner
              onScan={(scannedCode) => {
                setCode(scannedCode);
                setUseQR(false);
                setMessage({ type: 'info', text: 'Code scanned! Click "Confirm Attendance" to proceed.' });
              }}
              onCancel={() => setUseQR(false)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setUseQR(false)}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Cancel QR Scanner
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f9f9f9' }}>
        <h3>How to Confirm Your Attendance</h3>
        <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Enter your <strong>name</strong> (required)</li>
          <li>Optionally provide your <strong>email address</strong></li>
          <li>Enter the <strong>event code</strong> provided by the organizer, or <strong>scan the QR code</strong></li>
          <li>Click <strong>Confirm Attendance</strong></li>
          <li>You're done! Your attendance has been recorded</li>
        </ol>

        <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#666' }}>
          <strong>Note:</strong> The event must be currently OPEN (during the scheduled time) to confirm attendance.
        </p>
      </div>
    </div>
  );
}
