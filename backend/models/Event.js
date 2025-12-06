import Sequelize from 'sequelize';
import db from '../dbConfig.js';
import EventGroup from './EventGroup.js';

const Event = db.define('Event', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  groupId: { type: Sequelize.INTEGER, allowNull: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING },
  startTime: { type: Sequelize.DATE, allowNull: false },
  endTime: { type: Sequelize.DATE, allowNull: false },
  state: { type: Sequelize.ENUM('OPEN', 'CLOSED'), defaultValue: 'CLOSED' },
  codeText: { type: Sequelize.STRING, allowNull: false, unique: true },
  codeQRUrl: { type: Sequelize.STRING, allowNull: true }
});

Event.belongsTo(EventGroup, { foreignKey: 'groupId' });

export default Event;
