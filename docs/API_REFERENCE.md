# API Reference - Attendance Tracking Web Application

Complete API documentation for all endpoints.

---

## Base URL

**Development**: `http://localhost:4000/api`  
**Production**: `https://your-api-domain.com/api`

---

## Authentication

Currently, the API does not require authentication. This is suitable for a student project or private deployment.

For production with multiple organizations, consider adding:
- JWT tokens
- API keys
- OAuth 2.0

---

## Response Format

All responses are JSON. Errors include an `error` field.

### Success Response
```json
{
  "id": 1,
  "name": "Event Name",
  "state": "OPEN"
}
```

### Error Response
```json
{
  "error": "Event not found"
}
```

---

## Event Groups Endpoints

### Get All Event Groups

```http
GET /event-groups
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Tech Conference 2026",
    "description": "Annual technology conference",
    "startDate": "2026-03-01T00:00:00.000Z",
    "endDate": "2026-03-05T00:00:00.000Z",
    "createdAt": "2026-01-17T10:00:00.000Z",
    "updatedAt": "2026-01-17T10:00:00.000Z"
  }
]
```

---

### Get Single Event Group

```http
GET /event-groups/:id
```

**Parameters**:
- `id` (path) - Event group ID

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Tech Conference 2026",
  "description": "Annual technology conference",
  "startDate": "2026-03-01T00:00:00.000Z",
  "endDate": "2026-03-05T00:00:00.000Z",
  "Events": [
    {
      "id": 1,
      "title": "Opening Keynote",
      "state": "CLOSED",
      "startTime": "2026-03-01T09:00:00.000Z",
      "endTime": "2026-03-01T10:30:00.000Z"
    }
  ]
}
```

**Errors**:
- 404: Event group not found

---

### Create Event Group

```http
POST /event-groups
Content-Type: application/json

{
  "name": "Tech Conference 2026",
  "description": "Annual technology conference",
  "startDate": "2026-03-01",
  "endDate": "2026-03-05"
}
```

**Request Body**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Group name |
| description | string | No | Brief description |
| startDate | date | No | ISO 8601 format |
| endDate | date | No | ISO 8601 format |

**Response** (201 Created):
```json
{
  "id": 1,
  "name": "Tech Conference 2026",
  "description": "Annual technology conference",
  "startDate": "2026-03-01T00:00:00.000Z",
  "endDate": "2026-03-05T00:00:00.000Z"
}
```

**Errors**:
- 400: Name is required
- 500: Database error

---

### Update Event Group

```http
PUT /event-groups/:id
Content-Type: application/json

{
  "name": "Tech Summit 2026",
  "description": "Updated description"
}
```

**Response** (200 OK): Updated group object

---

### Delete Event Group

```http
DELETE /event-groups/:id
```

**Response** (200 OK):
```json
{
  "message": "Event group deleted successfully"
}
```

---

## Events Endpoints

### Get All Events

```http
GET /events
```

**Query Parameters**:
- None

**Response** (200 OK): Array of all events

---

### Get Event by ID

```http
GET /events/:id
```

**Response** (200 OK):
```json
{
  "id": 1,
  "groupId": 1,
  "title": "Opening Keynote",
  "description": "Welcome and opening speech",
  "startTime": "2026-03-01T09:00:00.000Z",
  "endTime": "2026-03-01T10:30:00.000Z",
  "state": "CLOSED",
  "codeText": "ABC123",
  "codeQRUrl": "https://api.qrserver.com/v1/create-qr-code/?data=ABC123"
}
```

---

### Get Events by Group

```http
GET /events/group/:groupId
```

**Parameters**:
- `groupId` (path) - Event group ID

**Response** (200 OK): Array of events in the group

---

### Create Event

```http
POST /events
Content-Type: application/json

{
  "groupId": 1,
  "title": "Opening Keynote",
  "description": "Welcome and opening speech",
  "startTime": "2026-03-01T09:00:00Z",
  "endTime": "2026-03-01T10:30:00Z"
}
```

**Request Body**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| groupId | number | No | Parent group ID |
| title | string | Yes | Event title |
| description | string | No | Event description |
| startTime | datetime | Yes | ISO 8601 format |
| endTime | datetime | Yes | ISO 8601 format |

**Response** (201 Created):
```json
{
  "id": 1,
  "groupId": 1,
  "title": "Opening Keynote",
  "description": "Welcome and opening speech",
  "startTime": "2026-03-01T09:00:00.000Z",
  "endTime": "2026-03-01T10:30:00.000Z",
  "state": "CLOSED",
  "codeText": "ABC123",
  "codeQRUrl": "https://api.qrserver.com/v1/create-qr-code/?data=ABC123"
}
```

**Errors**:
- 400: Title or times are required
- 500: Database error

---

### Update Event

```http
PUT /events/:id
Content-Type: application/json

{
  "title": "Opening Keynote - Updated",
  "description": "Updated description"
}
```

**Response** (200 OK): Updated event object

---

### Delete Event

```http
DELETE /events/:id
```

**Response** (200 OK):
```json
{
  "message": "Event deleted successfully"
}
```

---

### Force Open Event (Testing)

```http
POST /events/:id/force-open
```

**Response** (200 OK):
```json
{
  "id": 1,
  "state": "OPEN"
}
```

---

### Force Close Event (Testing)

```http
POST /events/:id/force-close
```

**Response** (200 OK):
```json
{
  "id": 1,
  "state": "CLOSED"
}
```

---

## Attendance Endpoints

### Confirm Attendance

```http
POST /attendance
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "code": "ABC123"
}
```

**Request Body**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Participant name |
| email | string | No | Participant email |
| code | string | Yes | Event access code (6 chars) |

**Response** (200 OK):
```json
{
  "message": "Attendance recorded",
  "attendance": {
    "id": 1,
    "participantId": 1,
    "eventId": 1,
    "timestamp": "2026-01-17T10:30:00.000Z"
  }
}
```

**Errors**:
- 400: Name or code is missing / Event is not OPEN
- 404: Event not found
- 500: Database error

---

### Get Event Attendance

```http
GET /attendance/event/:eventId
```

**Parameters**:
- `eventId` (path) - Event ID

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "participantId": 1,
    "eventId": 1,
    "timestamp": "2026-01-17T10:30:00.000Z",
    "Participant": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "Event": {
      "id": 1,
      "title": "Opening Keynote"
    }
  }
]
```

---

### Export Event Attendance as CSV

```http
GET /attendance/event/:eventId/export/csv
```

**Response** (200 OK): CSV file attachment
```
Participant Name,Email,Timestamp
John Doe,john@example.com,2026-01-17T10:30:00.000Z
Jane Smith,jane@example.com,2026-01-17T10:31:00.000Z
```

---

### Export Event Attendance as XLSX

```http
GET /attendance/event/:eventId/export/xlsx
```

**Response** (200 OK): Excel file attachment

---

### Export Group Attendance as CSV

```http
GET /attendance/group/:groupId/export/csv
```

**Response** (200 OK): CSV file with all events in group

**Format**:
```
Event,Participant Name,Email,Timestamp
Opening Keynote,John Doe,john@example.com,2026-01-17T10:30:00.000Z
Afternoon Session,Jane Smith,jane@example.com,2026-01-17T14:00:00.000Z
```

---

### Export Group Attendance as XLSX

```http
GET /attendance/group/:groupId/export/xlsx
```

**Response** (200 OK): Excel file with all events in group

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Curl Examples

### Create Event Group
```bash
curl -X POST http://localhost:4000/api/event-groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Festival",
    "description": "Annual summer festival",
    "startDate": "2026-06-01",
    "endDate": "2026-06-30"
  }'
```

### Create Event
```bash
curl -X POST http://localhost:4000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": 1,
    "title": "Main Stage Performance",
    "description": "Main stage live performances",
    "startTime": "2026-06-15T19:00:00Z",
    "endTime": "2026-06-15T22:00:00Z"
  }'
```

### Confirm Attendance
```bash
curl -X POST http://localhost:4000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "code": "ABC123"
  }'
```

### Get Event Attendance
```bash
curl http://localhost:4000/api/attendance/event/1
```

### Export as CSV
```bash
curl http://localhost:4000/api/attendance/event/1/export/csv > attendance.csv
```

### Export as XLSX
```bash
curl http://localhost:4000/api/attendance/event/1/export/xlsx > attendance.xlsx
```

---

## Rate Limiting

Currently not implemented. For production with high traffic, consider adding:
- Express rate limiter middleware
- API key validation
- Request throttling

---

## CORS

CORS is enabled for all origins. For production, restrict to your frontend domain:

```javascript
// In index.js
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

---

## Versioning

Current API version: `v1` (implicit)

For future versions, consider:
- `/api/v1/events`
- `/api/v2/events`

---

## Pagination

Not currently implemented. For large datasets, add:
- `?page=1&limit=20` parameters
- Response metadata with total count

---

## Advanced Queries

Consider adding for future enhancement:
- Filtering: `GET /events?state=OPEN&groupId=1`
- Sorting: `GET /events?sort=-startTime`
- Search: `GET /events?search=keynote`

---

**For more details, see [backend/README_COMPLETE.md](./backend/README_COMPLETE.md)**
