import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME
} = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST || 'localhost',
  port: DB_PORT || 3306,
  dialect: 'mariadb',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

export default db;
