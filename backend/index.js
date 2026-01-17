import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './dbConfig.js';
import Event from './models/Event.js';
import EventGroup from './models/EventGroup.js';
import Participant from './models/Participant.js';
import Attendance from './models/Attendance.js';
import eventRoutes from './routes/events.js';
import groupRoutes from './routes/eventGroups.js';
import attendanceRoutes from './routes/attendance.js';
import { startEventStateCron } from './jobs/eventStateCron.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://attendance-tracking-web.onrender.com' // Update with your frontend URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/events', eventRoutes);
app.use('/api/event-groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await db.authenticate();
    console.log('DB connected');
    
    // Skip sync on Render to avoid storage quota issues with FreeSQLDB
    if (process.env.NODE_ENV !== 'production') {
      await db.sync({ alter: true });
      console.log('DB synced');
    } else {
      console.log('DB sync skipped (production mode)');
    }

    // start cron job
    startEventStateCron();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start', err);
  }
})();
