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

const createDevisi = async (req, res) => {
  const { nama } = req.body;

  try {
    await Devisi.create({ nama });
    return res
      .status(200)
      .json({ meta: { status: 200, message: "Berhasil membuat devisi baru" } });
  } catch (error) {
    console.log(error);
  }
};

const updateDevisi = async (req, res) => {
  const { nama } = req.body;
  const { id } = req.params;
  try {
    if (!nama) {
      return res.status(404).json({
        meta: {
          status: 404,
          messsage: "Tidak ada data yang ingin di update",
        },
      });
    } else {
      const findDevisi = await Devisi.findOne({
        where: {
          id: id,
        },
      });
      await Devisi.update({ nama: nama || findDevisi.nama });

      return res.status(200).json({
        meta: {
          status: 200,
          message: `Berhasil update devisi dengan id ${id}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteDevisi = async (req, res) => {
  const { id } = req.params;

  try {
    await Devisi.destroy({ where: { id: id } });

    return res
      .status(200)
      .json({ meta: { status: 200, message: "Berhasil hapus devisi" } });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllDevisi, createDevisi, updateDevisi, deleteDevisi };
