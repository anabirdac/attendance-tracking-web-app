# Attendance Tracking Backend (Node.js + Express + Sequelize + MariaDB)

A RESTful API for managing event groups, events, and attendance tracking with automatic event state management and data export capabilities.

## ❀ Features

- **Event Management**: Create and manage event groups and events
- **Automatic State Management**: Events automatically transition between OPEN/CLOSED states based on scheduled times
- **Attendance Confirmation**: Participants confirm attendance using text codes or QR codes
- **Real-time Monitoring**: View attendee lists with timestamps
- **Data Export**: Export attendance records as CSV or XLSX files
- **QR Code Generation**: Automatic QR code generation for events
- **Participant Management**: Track participants and their attendance history

## ❀ Prerequisites

- **Node.js** (16+ recommended)
- **MariaDB** or **MySQL** (5.7+)
- **npm** (comes with Node.js)
- **Git** (for version control)

## ❀ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/anabirdac/attendance-tracking-web-app.git
cd attendance-tracking-web-app/backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- **express**: Web framework
- **sequelize**: ORM for database
- **mariadb**: MariaDB client
- **qrcode**: QR code generation
- **node-cron**: Scheduled tasks
- **json2csv** & **exceljs**: Data export
- **cors** & **body-parser**: Middleware
- **dotenv**: Environment variables

### 3. Create Database

Using **MariaDB command line** or **HeidiSQL**:

```sql
CREATE DATABASE attendance_tracking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

### 4. Configure Environment Variables

Copy the example file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_database_password
DB_NAME=attendance_tracking_db

# Server
PORT=4000

# QR Code API (optional)
QR_API=https://api.qrserver.com/v1/create-qr-code/?data=

# Environment
NODE_ENV=development
```

### 5. Start the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will:
- Connect to the database
- Auto-sync models (create/alter tables)
- Start the cron job for event state management
- Listen on port 4000 (or your configured PORT)

Expected output:
```
DB connected
DB synced
Server running on port 4000
```

## ❀ API Endpoints

### Event Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/event-groups` | Create a new event group |
| GET | `/api/event-groups` | List all event groups |
| GET | `/api/event-groups/:id` | Get group details with events |
| PUT | `/api/event-groups/:id` | Update a group |
| DELETE | `/api/event-groups/:id` | Delete a group |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create a new event |
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get event details |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/group/:groupId` | Get all events in a group |
| POST | `/api/events/:id/force-open` | Manually open event (testing) |
| POST | `/api/events/:id/force-close` | Manually close event (testing) |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Confirm attendance with code |
| GET | `/api/attendance/event/:eventId` | Get attendees for event |
| GET | `/api/attendance/event/:eventId/export/csv` | Export event attendance as CSV |
| GET | `/api/attendance/event/:eventId/export/xlsx` | Export event attendance as XLSX |
| GET | `/api/attendance/group/:groupId/export/csv` | Export group attendance as CSV |
| GET | `/api/attendance/group/:groupId/export/xlsx` | Export group attendance as XLSX |

## ❀ API Examples

### Create an Event Group

```bash
curl -X POST http://localhost:4000/api/event-groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2026",
    "description": "Annual technology conference",
    "startDate": "2026-03-01",
    "endDate": "2026-03-05"
  }'
```

### Create an Event

```bash
curl -X POST http://localhost:4000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": 1,
    "title": "Opening Keynote",
    "description": "Welcome and keynote speech",
    "startTime": "2026-03-01T09:00:00Z",
    "endTime": "2026-03-01T10:30:00Z"
  }'
```

### Confirm Attendance

```bash
curl -X POST http://localhost:4000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "code": "ABC123"
  }'
```

### Export Attendance as CSV

```bash
curl http://localhost:4000/api/attendance/event/1/export/csv > attendance.csv
```

### Export Attendance as XLSX

```bash
curl http://localhost:4000/api/attendance/event/1/export/xlsx > attendance.xlsx
```

## ❀ Database Schema

### Tables

- **EventGroups**: Groups of events
- **Events**: Individual events with codes and state
- **Participants**: Registered participants
- **Attendance**: Records of attendance confirmations

### Relationships

- EventGroup ← → Event (one-to-many)
- Event ← → Attendance (one-to-many)
- Participant ← → Attendance (one-to-many)

## ❀ Event State Management

Events automatically transition states based on scheduled times:

1. **CLOSED** (initial state)
2. **OPEN** (when current time enters [startTime, endTime])
3. **CLOSED** (when current time exceeds endTime)

The cron job runs every minute to check and update event states.

## ❀ Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful GET/PUT
- `201 Created`: Successful POST
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Example error response:

```json
{
  "error": "Event not found"
}
```

## ❀ Development Notes

- Uses **Sequelize** for ORM with auto-sync (`{ alter: true }`)
- **CORS** enabled for frontend integration
- Request body parsing with **body-parser** (JSON)
- External QR code generation via **qrserver.com** API
- Attendance exports using **json2csv** (CSV) and **exceljs** (XLSX)

## ❀ Troubleshooting

**Database Connection Error**
- Check DB credentials in `.env`
- Verify MariaDB is running
- Ensure database exists

**Port Already in Use**
- Change PORT in `.env`
- Or kill the process: `lsof -ti:4000 | xargs kill -9` (Mac/Linux)

**Missing Dependencies**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## ❀ Next Steps

1. Deploy backend to cloud service (Azure, AWS, Render, etc.)
2. Set environment variables on hosting platform
3. Initialize React frontend
4. Integrate frontend with API endpoints

For deployment instructions, see the main [README](../README.md).
