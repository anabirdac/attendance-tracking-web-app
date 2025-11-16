# Attendance Tracking Web Application – Detailed Specifications

---

## ❀ General Overview

This project is a web application designed to allow registration of a series of events and storing the attendance of a series of participants to a series of activities.
 
The system supports:
- Event organizers (EO) which can create events and monitor attendance;  
- Participants who confirm attendance using a text code or QR code.  

The application follows a **Single Page Application (SPA)** architecture with:
- A **React** front-end  
- A **Node.js REST API** back-end  
- A **relational database** accessed through an ORM  
- Integration with an external service (QR code generator)

---

## ❀ Functional Requirements

### **1. Users**
- **Event Organizer (EO)**
- **Participant**

---

### **2. Event Organizer Capabilities**

#### **Event Groups**
- Create an event group  
- An event group may contain:
  - a single event, or  
  - a series of events distributed over a time period  

#### **Events**
- Create events with:
  - title  
  - description  
  - date, start time, end time  
  - duration  
  - initial state = `CLOSED`
- System automatically:
  - switches event state to `OPEN` at the scheduled start time  
  - switches event state to `CLOSED` after the duration ends  
- On creation:
  - generate an access code (text)  
  - generate a QR code representation  

#### **Attendance Monitoring**
- View real-time list of attendees
- View timestamps for when each participant confirmed attendance
- Export attendance for a single event or full event group:
  - CSV export  
  - XLSX export  

---

### **3. Participant Capabilities**
- Confirm attendance by:
  - entering a text access code, or  
  - scanning a QR code via webcam  
- The system stores:
  - participant ID  
  - event ID  
  - timestamp of confirmation  

---

## ❀ Non-Functional Requirements

- **Architecture**: SPA front-end + REST back-end  
- **Front-end Framework**: React.js  
- **Back-end**: Node.js with Express  
- **Database**: Relational database (PostgreSQL / MySQL / SQLite)  
- **ORM**: Prisma / Sequelize / TypeORM  
- **Deployment**: Hosted on a cloud service with free tier (Azure, AWS, etc.)  
- **Code quality**:
  - clean file organization  
  - meaningful variable/function/class names  
  - comments on all classes and functions  
  - consistent formatting and indentation  
- **Version control**:
  - Git repository with incremental commits  
  - clear commit messages  

---

## ❀ System Architecture

[ React Front-End (SPA) ]
|
| (HTTPS / REST API calls)
|
[ Node.js + Express Back-End ]
|
| (ORM)
|
[ Relational Database ]
|
| (HTTP API request)
|
[ External Service (QR Generator) ]

---

## ❀ Database Schema (Initial Proposal)

## ❀ API Endpoints (Initial Definition)

### **Event Groups**
POST /event-groups
GET /event-groups
GET /event-groups/:id

### **Events**
POST /events
GET /events/:id
POST /events/:id/open
POST /events/:id/close

### **Attendance**
POST /attendance
GET /events/:id/attendance

### **Exports**
GET /events/:id/export?format=csv
GET /events/:id/export?format=xlsx

