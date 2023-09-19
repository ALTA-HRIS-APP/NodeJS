const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  nama_lengkap: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surel: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jabatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kata_sandi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  employee_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
});

module.exports = User;
