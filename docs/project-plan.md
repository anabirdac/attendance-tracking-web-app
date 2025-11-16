# Project Plan – Attendance Tracking Web Application ❀

---

## ❀ Project Timeline (Milestones)

| Deadline       | Deliverable                                    |
|----------------|------------------------------------------------|
| **16.11.2025** | Detailed specifications, project plan, Git setup |
| **06.12.2025** | Functional RESTful service + run instructions  |
| **Last tutorial** | Complete application (front-end + backend) |

---

## ❀ High-Level Development Phases

### Phase 1 — Planning & Setup - weeks 6-7 ❀
- Create GitHub repository
- Add collaborators
- Add project documentation
- Define requirements
- Create folder structure (backend, frontend, docs)
- Draft database schema
- Draft API design

---

### Phase 2 — Backend Development - weeks 8-10 ❀

#### Week 8
- Initialize Node.js backend
- Setup Express server
- Setup ORM (Prisma / Sequelize)
- Define models (EventGroup, Event, Participant, Attendance)

#### Week 9
- Implement CRUD for EventGroup
- Implement CRUD for Event
- Implement automatic OPEN/CLOSED logic

#### Week 10
- Implement attendance confirmation endpoint
- Integrate external QR code API
- Implement export (CSV/XLSX)
- Write run instructions in README

---

### Phase 3 — Frontend Development - weeks 11-12 ❀

#### Week 11
- Initialize React project
- Create main pages:
  - Dashboard  
  - Event group management  
  - Event viewer  

#### Week 12
- Integrate API endpoints
- Implement QR reader (webcam)
- Implement participant attendance pages
- Styling, responsive design
- Export buttons UI
- Test interactions end-to-end

---

### Phase 4 — Deployment & Final Demo - Week 13 ❀

- Deploy backend (Azure / AWS / Render)
- Deploy frontend (Vercel / Netlify)
- Configure environment variables
- Final bug fixes and cleanup
- Prepare demo

---

## ❀ Task Breakdown by Component

### ❀ Backend
- Setup project structure  
- Add Express server  
- Add ORM + database connection  
- Define models and migrations  
- Create event group controller  
- Create event controller  
- Implement state logic (OPEN/CLOSED)  
- Implement QR code generator integration  
- Implement attendance controller  
- Implement export service  
- Write backend README with run instructions  

---

### ❀ Frontend
- Setup React project  
- Create components for:
  - Event group list  
  - Event form  
  - Event details  
  - Attendance screen  
  - QR scanner  
- Handle API communication  
- Handle code entry + QR scanning  
- Display real-time attendance  
- Add data export UI  

---

### ❀ DevOps & Repository
- Maintain clean commit history  
- Add .gitignore  
- Add .env.example  
- Document backend & frontend  
- Deployment configuration  

---
