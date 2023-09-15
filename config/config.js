const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize({
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASENAME,
  host: process.env.HOST,
  dialect: "mysql",
});

module.exports = sequelize;
