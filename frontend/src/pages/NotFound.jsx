/**
 * Not Found (404) Page Component
 */

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</div>
      <h1>Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn">Back to Home</Link>
    </div>
  );
}
