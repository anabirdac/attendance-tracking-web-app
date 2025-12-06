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
app.use(cors());
app.use(bodyParser.json());

app.use('/api/events', eventRoutes);
app.use('/api/event-groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await db.authenticate();
    console.log('DB connected');
    
    await db.sync({ alter: true });
    console.log('DB synced');

    // start cron job
    startEventStateCron();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start', err);
  }
})();
