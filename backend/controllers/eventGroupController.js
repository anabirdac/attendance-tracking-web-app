import EventGroup from '../models/EventGroup.js';
import Event from '../models/Event.js';

/**
 * Creates a new event group
 */
export const createGroup = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    
    // Validate required fields
    if (!name) return res.status(400).json({ error: 'Group name is required' });
    
    const group = await EventGroup.create({
      name,
      description,
      startDate,
      endDate
    });
    
    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all event groups, ordered by start date
 */
export const listGroups = async (req, res) => {
  try {
    const groups = await EventGroup.findAll({
      order: [['startDate', 'ASC']]
    });
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves a specific event group with all its events
 */
export const getGroup = async (req, res) => {
  try {
    const g = await EventGroup.findByPk(req.params.id, {
      include: [{ model: Event, attributes: ['id', 'title', 'state', 'startTime', 'endTime'] }]
    });
    if (!g) return res.status(404).json({ error: 'Group not found' });
    res.json(g);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Updates an event group
 */
export const updateGroup = async (req, res) => {
  try {
    const g = await EventGroup.findByPk(req.params.id);
    if (!g) return res.status(404).json({ error: 'Group not found' });
    await g.update(req.body);
    res.json(g);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes an event group and all its associated events and attendance records
 */
export const deleteGroup = async (req, res) => {
  try {
    const g = await EventGroup.findByPk(req.params.id);
    if (!g) return res.status(404).json({ error: 'Group not found' });
    await g.destroy();
    res.json({ message: 'Event group deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
