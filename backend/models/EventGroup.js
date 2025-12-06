import Sequelize from 'sequelize';
import db from '../dbConfig.js';

const EventGroup = db.define('EventGroup', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: true
  }
});

export default EventGroup;
