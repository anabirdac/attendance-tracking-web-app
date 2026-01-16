import express from 'express';
import {
  confirmAttendance,
  getEventAttendance,
  exportEventAsCSV,
  exportEventAsXLSX,
  exportGroupAsCSV,
  exportGroupAsXLSX
} from '../controllers/attendanceController.js';

const router = express.Router();

// Confirm attendance with code
router.post('/', confirmAttendance);

// Get attendees for a specific event
router.get('/event/:eventId', getEventAttendance);

// Export attendance for single event
router.get('/event/:eventId/export/csv', exportEventAsCSV);
router.get('/event/:eventId/export/xlsx', exportEventAsXLSX);

// Export attendance for entire event group
router.get('/group/:groupId/export/csv', exportGroupAsCSV);
router.get('/group/:groupId/export/xlsx', exportGroupAsXLSX);

export default router;
