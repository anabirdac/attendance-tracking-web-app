# Attendance Tracking Frontend (React.js SPA)

A modern, responsive single-page application built with React.js for event organizers and participants.

## ❀ Features

- **Event Management Dashboard**: Create, view, and manage event groups and events
- **QR Code Scanning**: Scan QR codes using webcam to confirm attendance
- **Code Entry**: Manual text code entry for participants without camera
- **Real-time Attendance**: View attendees in real-time with timestamps
- **Data Export**: Download attendance records in CSV/XLSX formats
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **User Authentication**: Distinguish between organizer and participant views

## ❀ Prerequisites

- Node.js 14+ and npm
- React 18+
- Backend API running (see [backend README](../backend/README_COMPLETE.md))

## ❀ Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- **react**: UI framework
- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API calls
- **html5-qrcode**: QR code scanning library

### 2. Configure Environment

Create `.env` file in the frontend directory:

```bash
echo "REACT_APP_API_URL=http://localhost:4000/api" > .env
```

For production, update to your backend URL:

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## ❀ Project Structure

```
src/
├── components/           # Reusable React components
│   ├── EventForm.jsx    # Form for creating events
│   ├── EventList.jsx    # Display list of events
│   ├── AttendeeList.jsx # Show attendees for event
│   ├── QRScanner.jsx    # QR code scanner
│   └── CodeInput.jsx    # Text code input
├── pages/               # Page components
│   ├── HomePage.jsx     # Dashboard/home page
│   ├── OrganizerDash.jsx # Organizer view
│   ├── ParticipantView.jsx # Participant view
│   ├── EventDetail.jsx  # Single event details
│   └── NotFound.jsx     # 404 page
├── services/           # API communication
│   └── api.js          # Axios API client
├── App.js              # Main app component with routes
├── App.css             # Global styles
└── index.js            # React entry point
```

## ❀ Key Components

### OrganizerDash (Event Organizer)

Features:
- Create event groups
- Create events in groups
- View all events and groups
- Monitor attendance in real-time
- Export attendance (CSV/XLSX)
- View event details and access codes

**Routes**:
- `/organizer/dashboard` - Main dashboard
- `/organizer/groups` - Manage groups
- `/organizer/events` - Manage events
- `/organizer/event/:id` - Event details & attendance

### ParticipantView (Participant)

Features:
- Scan QR code with webcam
- Enter event code manually
- Confirm attendance
- View personal attendance history

**Routes**:
- `/participant` - Attendance entry page
- `/participant/history` - Personal attendance history

### HomePage

- Landing page with login options
- Choose organizer or participant mode

## ❀ API Integration

All API calls go through `src/services/api.js`:

```javascript
// Example: Get all event groups
import { api } from './services/api';

api.get('/event-groups')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

**Available API Methods**:

```javascript
// Event Groups
api.get('/event-groups')
api.post('/event-groups', groupData)
api.get('/event-groups/:id')
api.put('/event-groups/:id', updates)
api.delete('/event-groups/:id')

// Events
api.get('/events')
api.post('/events', eventData)
api.get('/events/:id')
api.get('/events/group/:groupId')
api.put('/events/:id', updates)
api.delete('/events/:id')

// Attendance
api.post('/attendance', { name, email, code })
api.get('/attendance/event/:eventId')
api.get('/attendance/event/:eventId/export/csv')
api.get('/attendance/event/:eventId/export/xlsx')
api.get('/attendance/group/:groupId/export/csv')
api.get('/attendance/group/:groupId/export/xlsx')
```

## ❀ Component Examples

### Creating an Event Group

```jsx
import { useState } from 'react';
import { api } from '../services/api';

export function CreateGroupForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/event-groups', {
        name,
        description,
        startDate: new Date(),
        endDate: new Date()
      });
      console.log('Group created:', response.data);
      // Redirect or refresh list
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Group name"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Create Group</button>
    </form>
  );
}
```

### QR Code Scanner

```jsx
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export function QRScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render((decodedText) => {
      onScan(decodedText);
      scanner.clear();
    }, (error) => {
      // Handle error
    });

    return () => scanner.clear();
  }, [onScan]);

  return <div id="reader"></div>;
}
```

### Confirm Attendance

```jsx
import { useState } from 'react';
import { api } from '../services/api';
import { QRScanner } from '../components/QRScanner';

export function ParticipantView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [useQR, setUseQR] = useState(false);
  const [message, setMessage] = useState('');

  const handleConfirm = async () => {
    try {
      const response = await api.post('/attendance', {
        name,
        email,
        code
      });
      setMessage('✓ Attendance confirmed!');
      setCode('');
      setName('');
      setEmail('');
    } catch (error) {
      setMessage('✗ Error: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Confirm Your Attendance</h1>
      
      {!useQR ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (optional)"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Event code"
            maxLength="6"
          />
          <button onClick={handleConfirm}>Confirm Attendance</button>
          <button onClick={() => setUseQR(true)}>Use QR Scanner</button>
        </>
      ) : (
        <>
          <QRScanner onScan={(data) => {
            setCode(data);
            setUseQR(false);
          }} />
          <button onClick={() => setUseQR(false)}>Cancel QR Scanner</button>
        </>
      )}
      
      {message && <p>{message}</p>}
    </div>
  );
}
```

## ❀ Styling

Create `src/App.css` for global styles:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #0056b3;
}

input, select {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
}

table th, table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #007bff;
  color: white;
}

table tr:hover {
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  table {
    font-size: 0.9rem;
  }
}
```

## ❀ Routing Setup

```jsx
// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrganizerDash from './pages/OrganizerDash';
import ParticipantView from './pages/ParticipantView';
import EventDetail from './pages/EventDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/organizer/*" element={<OrganizerDash />} />
        <Route path="/participant/*" element={<ParticipantView />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
```

## ❀ Development Workflow

1. Start backend: `npm run dev` in `/backend`
2. Start frontend: `npm start` in `/frontend`
3. Use React Developer Tools browser extension for debugging
4. Check Network tab in browser DevTools for API calls

## ❀ Common Issues

**API Connection Error**
- Verify backend is running on port 4000
- Check CORS is enabled in backend
- Verify `REACT_APP_API_URL` in `.env`

**QR Scanner Not Working**
- Allow camera permissions in browser
- Use HTTPS (or localhost)
- Ensure html5-qrcode is installed

**Build Fails**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## ❀ Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended for React)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect your GitHub repo
4. Set environment variable: `REACT_APP_API_URL=https://your-api.com/api`
5. Deploy

### Deploy to Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

## ❀ Next Steps

- [ ] Create individual component files
- [ ] Add authentication/login system
- [ ] Implement error boundary for better error handling
- [ ] Add loading states and spinners
- [ ] Implement form validation
- [ ] Add dark mode toggle
- [ ] Implement real-time updates with WebSockets
- [ ] Add unit tests with Jest/React Testing Library

## ❀ Documentation

- [Backend API Guide](../backend/README_COMPLETE.md)
- [Project Specifications](../docs/specifications.md)
- [React Documentation](https://react.dev)

---

**Status**: Initial Setup Complete  
**Last Updated**: January 17, 2026
