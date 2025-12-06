import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import Attendance from '../models/Attendance.js';

export const confirmAttendance = async (req, res) => {
  try {
    const { name, email, code } = req.body; // from frontend or decoded QR
    if (!code) return res.status(400).json({ error: 'Missing event code' });

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
