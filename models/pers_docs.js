const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Persdocs = sequelize.define("Persdocs", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  no_kk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url_kk: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  no_npwp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url_npwp: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  no_bpjs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url_bpjs: {
    type: DataTypes.JSON,
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
  // Kolom lainnya jika diperlukan
});

module.exports = Persdocs;
