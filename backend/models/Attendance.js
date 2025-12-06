import Sequelize from 'sequelize';
import db from '../dbConfig.js';
import Participant from './Participant.js';
import Event from './Event.js';

const Attendance = db.define('Attendance', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  participantId: { type: Sequelize.INTEGER, allowNull: false },
  eventId: { type: Sequelize.INTEGER, allowNull: false },
  timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

Attendance.belongsTo(Participant, { foreignKey: 'participantId' });
Attendance.belongsTo(Event, { foreignKey: 'eventId' });

Event.hasMany(Attendance, { foreignKey: 'eventId' });
Participant.hasMany(Attendance, { foreignKey: 'participantId' });

export default Attendance;
