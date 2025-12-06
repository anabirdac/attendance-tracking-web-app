import express from 'express';
import {
  createEvent, listEvents, getEvent, updateEvent, deleteEvent, forceOpen, forceClose
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', listEvents);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

router.post('/:id/force-open', forceOpen); // debug
router.post('/:id/force-close', forceClose); // debug

export default router;
