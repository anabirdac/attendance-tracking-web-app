import express from 'express';
import {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  forceOpen,
  forceClose,
  getEventsByGroup
} from '../controllers/eventController.js';

const router = express.Router();

// Event CRUD operations
router.post('/', createEvent);
router.get('/', listEvents);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Get events by group
router.get('/group/:groupId', getEventsByGroup);

// Testing/override endpoints
router.post('/:id/force-open', forceOpen);
router.post('/:id/force-close', forceClose);

export default router;
