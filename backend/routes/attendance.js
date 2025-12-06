import express from 'express';
import { confirmAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', confirmAttendance);

export default router;
