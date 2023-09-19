const db = require("../models");
const Role = db.role;

const getAll = async (req, res) => {
  try {
    const find = await Role.findAll();
    return res.status(200).json({
      meta: { status: 200, message: "Berhasil ambil data" },
      data: find,
    });
  } catch (error) {
    return res.status(404).json({
      meta: { status: 404, message: "Tidak ada data Devisi" },
    });
  }
};

module.exports = getAll;
