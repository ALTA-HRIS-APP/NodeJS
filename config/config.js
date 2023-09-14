const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  username: "otix7231_admin",
  password: "Penting123!",
  database: "otix7231_project2",
  host: "151.106.119.201",
  dialect: "mysql",
});

module.exports = sequelize;
