const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Devisi = sequelize.define("Devisi", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  nama: {
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
  // Kolom lainnya jika diperlukan
});

module.exports = Devisi;
