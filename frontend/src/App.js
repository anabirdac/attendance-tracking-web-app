/**
 * Main App Component
 * Sets up React Router and main navigation structure
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import OrganizerDash from './pages/OrganizerDash';
import ParticipantView from './pages/ParticipantView';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              📊 Attendance Tracker
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/organizer/*" element={<OrganizerDash />} />
            <Route path="/participant/*" element={<ParticipantView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2026 Attendance Tracking Application. Team CoffeBreak.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
