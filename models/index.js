const sequelize = require("../config/config");
const Detailcompany = require("./detailcompany");
const Devisi = require("./devisi");
const Persdocs = require("./pers_docs");
const Role = require("./role");
const User = require("./user");

const db = {};
db.Sequelize = sequelize;
db.user = User;
db.devisi = Devisi;
db.role = Role;
db.persdocs = Persdocs;
db.detailcompany = Detailcompany;

// Relation
db.devisi.hasMany(db.user, { foreignKey: "devisiId", as: "user" });
db.user.belongsTo(db.devisi, { foreignKey: "devisiId", as: "devisi" });

db.role.hasMany(db.user, { foreignKey: "roleId", as: "user" });
db.user.belongsTo(db.role, { foreignKey: "roleId", as: "role" });

db.user.hasOne(db.persdocs, { foreignKey: "userId", as: "persdocs" });
db.persdocs.belongsTo(db.user, { foreignKey: "userId", as: "user" });

module.exports = db;
