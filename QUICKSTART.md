# Quick Start Guide - Attendance Tracking Application

**Get the application running in 5 minutes!**

---

## Prerequisites

- Node.js 16+ installed
- MariaDB/MySQL running
- Git installed

---

## Step 1: Clone & Navigate to Project

```bash
git clone https://github.com/anabirdac/attendance-tracking-web-app.git
cd attendance-tracking-web-app
```

---

## Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env - Update database credentials
# Windows: notepad .env
# Mac/Linux: nano .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=attendance_tracking_db
PORT=4000
```

Create the database in MariaDB:
```sql
CREATE DATABASE attendance_tracking_db CHARACTER SET utf8mb4;
```

Start the backend:
```bash
npm run dev
```

**Expected output**:
```
DB connected
DB synced
Server running on port 4000
```

---

## Step 3: Setup Frontend

**In a new terminal**, navigate to frontend:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:4000/api" > .env

# Start development server
npm start
```

**Opens automatically at**: http://localhost:3000

---

## Step 4: Test the Application

### As an Event Organizer:

1. Click **"Event Organizer"** button on home page
2. Click **"Go to Dashboard"**
3. Click **"Go to Groups"**
4. Fill in:
   - Group Name: "My Event Group"
   - Description: "Test group"
5. Click **"Create Event Group"**

### As a Participant:

1. Click **"Participant"** button on home page
2. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com" (optional)
   - Event Code: (get from organizer)
3. Click **"Confirm Attendance"** or **"Scan QR Code"**

---

## Step 5: Access the Application

| Role | URL | Actions |
|------|-----|---------|
| Home | http://localhost:3000 | Choose role |
| Organizer | http://localhost:3000/organizer/dashboard | Create groups/events |
| Participant | http://localhost:3000/participant | Confirm attendance |

---

## API Endpoints (Backend)

Test the API directly:

```bash
# Get all event groups
curl http://localhost:4000/api/event-groups

# Create event group
curl -X POST http://localhost:4000/api/event-groups \
  -H "Content-Type: application/json" \
  -d '{"name":"My Group","description":"Test"}'

# Confirm attendance
curl -X POST http://localhost:4000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@test.com","code":"ABC123"}'
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
# Windows: netstat -ano | findstr :4000
# Mac/Linux: lsof -i :4000

# Try different port - edit .env
PORT=5000
```

### Database connection error
- Verify MariaDB is running
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE attendance_tracking_db;`

### Frontend shows API error
- Verify backend is running on port 4000
- Check CORS is enabled (should be by default)
- Verify `.env` has correct `REACT_APP_API_URL`

### QR Scanner not working
- Allow camera permissions in browser
- Only works over HTTPS (or localhost)
- Check browser console for errors

---

## Next Steps

1. **Explore the application** - Create events and confirm attendance
2. **Read documentation** - Check [README_COMPLETE.md](./README_COMPLETE.md) for full details
3. **Deploy** - Follow deployment guide for production
4. **Add features** - See IMPLEMENTATION_SUMMARY.md for future enhancements

---

## Common Commands

```bash
# Terminal 1: Start Backend
cd backend && npm run dev

# Terminal 2: Start Frontend
cd frontend && npm start

# Build for production
cd frontend && npm run build

# Reset database
DROP DATABASE attendance_tracking_db;
CREATE DATABASE attendance_tracking_db CHARACTER SET utf8mb4;

# View backend logs
pm2 logs attendance-api  # If using PM2
```

---

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| Backend config | `backend/.env` | Database & server settings |
| Frontend config | `frontend/.env` | API URL |
| Backend docs | `backend/README_COMPLETE.md` | Full backend guide |
| Frontend docs | `frontend/README.md` | Full frontend guide |
| Project docs | `docs/` | Specifications & plans |

---

## Getting Help

1. **Check README files** in `backend/`, `frontend/`, and root
2. **Check documentation** in `docs/` folder
3. **Check console errors** in browser DevTools
4. **Check backend logs** in terminal
5. **Create GitHub issue** with details

---

**You're all set! Enjoy using the Attendance Tracking Application! 🎉**

For full details, see [README_COMPLETE.md](./README_COMPLETE.md)
