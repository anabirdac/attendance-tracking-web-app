import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import Attendance from '../models/Attendance.js';
import EventGroup from '../models/EventGroup.js';
import { generateCSV, generateXLSX } from '../utils/exportService.js';
import { Op } from 'sequelize';

/**
 * Confirms attendance for a participant to an event.
 * Accepts either text code or QR code (already decoded).
 * If email provided, uses findOrCreate to avoid duplicates; otherwise creates new participant.
 */
export const confirmAttendance = async (req, res) => {
  try {
    const { name, email, code } = req.body; // from frontend or decoded QR
    if (!code) return res.status(400).json({ error: 'Missing event code' });
    if (!name) return res.status(400).json({ error: 'Missing participant name' });

    // Find event by codeText
    const ev = await Event.findOne({ where: { codeText: code } });
    if (!ev) return res.status(404).json({ error: 'Event not found' });

    // If event is closed
    if (ev.state !== 'OPEN') {
      return res.status(400).json({ error: 'Event is not open for attendance' });
    }

    // Find or create participant (by email if available)
    let participant;
    if (email) {
      [participant,] = await Participant.findOrCreate({ where: { email }, defaults: { name, email } });
    } else {
      participant = await Participant.create({ name });
    }

    // Create attendance record (prevent duplicates if desired)
    const attendance = await Attendance.create({ participantId: participant.id, eventId: ev.id });

    res.json({ message: 'Attendance recorded', attendance });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all attendees for a specific event
 */
export const getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Verify event exists
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Get all attendance records with participant details
    const attendanceRecords = await Attendance.findAll({
      where: { eventId },
      include: [
        { model: Participant, attributes: ['id', 'name', 'email'] },
        { model: Event, attributes: ['id', 'title'] }
      ],
      order: [['timestamp', 'ASC']]
    });

    res.json(attendanceRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Exports attendance for a single event as CSV
 */
export const exportEventAsCSV = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const attendanceRecords = await Attendance.findAll({
      where: { eventId },
      include: [{ model: Participant, attributes: ['name', 'email'] }]
    });

    // Transform data for CSV export
    const csvData = attendanceRecords.map(record => ({
      'Participant Name': record.Participant.name,
      'Email': record.Participant.email || '',
      'Timestamp': record.timestamp
    }));

    const csv = generateCSV(csvData, ['Participant Name', 'Email', 'Timestamp']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_${eventId}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Exports attendance for a single event as XLSX
 */
export const exportEventAsXLSX = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const attendanceRecords = await Attendance.findAll({
      where: { eventId },
      include: [{ model: Participant, attributes: ['name', 'email'] }]
    });

    // Transform data for XLSX export
    const xlsxData = attendanceRecords.map(record => ({
      'Participant Name': record.Participant.name,
      'Email': record.Participant.email || '',
      'Timestamp': record.timestamp
    }));

    const buffer = await generateXLSX(xlsxData, `Event_${eventId}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_${eventId}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Exports attendance for an entire event group as CSV
 */
export const exportGroupAsCSV = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const group = await EventGroup.findByPk(groupId);
    if (!group) return res.status(404).json({ error: 'Event group not found' });

    // Get all events in the group
    const events = await Event.findAll({ where: { groupId } });
    const eventIds = events.map(e => e.id);

    // Get all attendance for these events
    const attendanceRecords = await Attendance.findAll({
      where: { eventId: { [Op.in]: eventIds } },
      include: [
        { model: Participant, attributes: ['name', 'email'] },
        { model: Event, attributes: ['id', 'title'] }
      ]
    });

    // Transform data for CSV export
    const csvData = attendanceRecords.map(record => ({
      'Event': record.Event.title,
      'Participant Name': record.Participant.name,
      'Email': record.Participant.email || '',
      'Timestamp': record.timestamp
    }));

    const csv = generateCSV(csvData, ['Event', 'Participant Name', 'Email', 'Timestamp']);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_group_${groupId}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Exports attendance for an entire event group as XLSX
 */
export const exportGroupAsXLSX = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const group = await EventGroup.findByPk(groupId);
    if (!group) return res.status(404).json({ error: 'Event group not found' });

    // Get all events in the group
    const events = await Event.findAll({ where: { groupId } });
    const eventIds = events.map(e => e.id);

    // Get all attendance for these events
    const attendanceRecords = await Attendance.findAll({
      where: { eventId: { [Op.in]: eventIds } },
      include: [
        { model: Participant, attributes: ['name', 'email'] },
        { model: Event, attributes: ['id', 'title'] }
      ]
    });

    // Transform data for XLSX export
    const xlsxData = attendanceRecords.map(record => ({
      'Event': record.Event.title,
      'Participant Name': record.Participant.name,
      'Email': record.Participant.email || '',
      'Timestamp': record.timestamp
    }));

    const buffer = await generateXLSX(xlsxData, `Group_${groupId}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="attendance_group_${groupId}.xlsx"`);
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
