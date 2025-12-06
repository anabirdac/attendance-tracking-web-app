import EventGroup from '../models/EventGroup.js';

export const createGroup = async (req, res) => {
  try {
    const group = await EventGroup.create(req.body);
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listGroups = async (req, res) => {
  const groups = await EventGroup.findAll({ order: [['startDate','ASC']]});
  res.json(groups);
};

export const getGroup = async (req, res) => {
  const g = await EventGroup.findByPk(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  res.json(g);
};

export const updateGroup = async (req, res) => {
  const g = await EventGroup.findByPk(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  await g.update(req.body);
  res.json(g);
};

export const deleteGroup = async (req, res) => {
  const g = await EventGroup.findByPk(req.params.id);
  if (!g) return res.status(404).json({ error: 'Group not found' });
  await g.destroy();
  res.json({ message: 'deleted' });
};
