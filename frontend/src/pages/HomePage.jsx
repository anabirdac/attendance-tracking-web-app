/**
 * Home Page Component
 * Landing page with navigation to organizer and participant views
 */

import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center' }}>
        <h1>📊 Welcome to Attendance Tracker</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
          A modern solution for managing event attendance
        </p>

        <div className="grid" style={{ marginTop: '3rem' }}>
          {/* Organizer Card */}
          <div className="card">
            <div className="card-body">
              <h2 style={{ marginBottom: '1rem' }}>👔 Event Organizer</h2>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Create events, generate codes, monitor attendance in real-time, and export reports
              </p>
              <Link to="/organizer/dashboard" className="btn btn-success" style={{ width: '100%' }}>
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Participant Card */}
          <div className="card">
            <div className="card-body">
              <h2 style={{ marginBottom: '1rem' }}>👤 Participant</h2>
              <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                Confirm your attendance by scanning QR codes or entering event codes
              </p>
              <Link to="/participant" className="btn" style={{ width: '100%' }}>
                Confirm Attendance
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginTop: '3rem' }}>
          <h2>✨ Key Features</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>📱 QR Code Scanning</h3>
              <p>Scan QR codes directly from your device's camera</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>📝 Code Entry</h3>
              <p>Enter event codes manually if you don't have camera access</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>📊 Real-time Monitoring</h3>
              <p>View attendee lists with timestamps instantly</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>📥 Data Export</h3>
              <p>Download attendance records in CSV or Excel format</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>🎯 Event Groups</h3>
              <p>Organize multiple events into logical groups</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>⚡ Automatic State Management</h3>
              <p>Events automatically open and close based on schedule</p>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2>🛠️ Technology Stack</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Built with modern, reliable technologies:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <span>React.js</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>Express.js</span>
            <span>•</span>
            <span>MariaDB</span>
            <span>•</span>
            <span>Sequelize ORM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
