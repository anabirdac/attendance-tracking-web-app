import Sequelize from 'sequelize';
import db from '../dbConfig.js';

const Participant = db.define('Participant', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: true, unique: false }
});

export default Participant;
