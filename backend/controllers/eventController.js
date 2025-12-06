import Event from '../models/Event.js';
import EventGroup from '../models/EventGroup.js';
import { generateQrExternal, generateQrBase64 } from '../utils/qrService.js';
import crypto from 'crypto';


function randomCode(len = 6) {
  return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0, len).toUpperCase();
}

export const createEvent = async (req, res) => {
  try {
    const { groupId, title, description, startTime, endTime } = req.body;
    const codeText = randomCode(6);
    const codeQRUrl = await generateQrExternal(codeText); // external API
    const ev = await Event.create({ groupId, title, description, startTime, endTime, codeText, codeQRUrl, state: 'CLOSED' });
    res.status(201).json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listEvents = async (req, res) => {
  const events = await Event.findAll({ order: [['startTime','ASC']]});
  res.json(events);
};

export const getEvent = async (req, res) => {
  const ev = await Event.findByPk(req.params.id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  res.json(ev);
};

export const updateEvent = async (req, res) => {
  const ev = await Event.findByPk(req.params.id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  await ev.update(req.body);
  res.json(ev);
};

export const deleteEvent = async (req, res) => {
  const ev = await Event.findByPk(req.params.id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  await ev.destroy();
  res.json({ message: 'deleted' });
};

export const forceOpen = async (req, res) => {
  const ev = await Event.findByPk(req.params.id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  await ev.update({ state: 'OPEN' });
  res.json(ev);
};

export const forceClose = async (req, res) => {
  const ev = await Event.findByPk(req.params.id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  await ev.update({ state: 'CLOSED' });
  res.json(ev);
};

