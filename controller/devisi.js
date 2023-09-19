const db = require("../models");
const Devisi = db.devisi;

const getAllDevisi = async (req, res) => {
  try {
    const getAll = await Devisi.findAll();

    return res.status(200).json({
      meta: { status: 200, message: "Berhasil get Data Devisi" },
      data: getAll,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getAllDevisi;
