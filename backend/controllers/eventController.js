import Event from '../models/Event.js';
import EventGroup from '../models/EventGroup.js';
import { generateQrExternal, generateQrBase64 } from '../utils/qrService.js';
import crypto from 'crypto';

/**
 * Generates a random alphanumeric code of specified length
 */
function randomCode(len = 6) {
  return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0, len).toUpperCase();
}

/**
 * Creates a new event with auto-generated access codes
 */
export const createEvent = async (req, res) => {
  try {
    const { groupId, title, description, startTime, endTime } = req.body;
    
    // Validate required fields
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!startTime) return res.status(400).json({ error: 'Start time is required' });
    if (!endTime) return res.status(400).json({ error: 'End time is required' });

    const codeText = randomCode(6);
    const codeQRUrl = await generateQrExternal(codeText); // external API
    
    const ev = await Event.create({
      groupId,
      title,
      description,
      startTime,
      endTime,
      codeText,
      codeQRUrl,
      state: 'CLOSED'
    });
    
    res.status(201).json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all events, ordered by start time
 */
export const listEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: EventGroup, attributes: ['id', 'name'] }],
      order: [['startTime', 'ASC']]
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves a specific event by ID
 */
export const getEvent = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id, {
      include: [{ model: EventGroup, attributes: ['id', 'name'] }]
    });
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Updates an event's details
 */
export const updateEvent = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    await ev.update(req.body);
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes an event and its associated attendance records
 */
export const deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    await ev.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all events in a specific event group
 */
export const getEventsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Verify group exists
    const group = await EventGroup.findByPk(groupId);
    if (!group) return res.status(404).json({ error: 'Event group not found' });
    
    const events = await Event.findAll({
      where: { groupId },
      order: [['startTime', 'ASC']]
    });
    
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Manually opens an event (for testing/override purposes)
 */
export const forceOpen = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    await ev.update({ state: 'OPEN' });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Manually closes an event (for testing/override purposes)
 */
export const forceClose = async (req, res) => {
  try {
    const ev = await Event.findByPk(req.params.id);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    await ev.update({ state: 'CLOSED' });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

