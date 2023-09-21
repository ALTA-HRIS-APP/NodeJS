const db = require("../models");
const Devisi = db.devisi;

const createValidation = async (req, res, next) => {
  const { nama } = req.body;

  const findDevisi = await Devisi.findOne({
    where: {
      nama: nama,
    },
  });
  if (findDevisi) {
    return res.status(400).json({
      meta: {
        status: 400,
        message: `Devisi dengan nama ${nama} telah di gunakan`,
      },
    });
  }

  if (!nama) {
    return res.status(400).json({
      meta: { status: 400, message: "Nama devisi tidak boleh kosong" },
    });
  }

  const testInput = /^[a-zA-Z0-9]+$/.test(nama);
  if (!testInput) {
    return res.status(400).json({
      meta: {
        status: 400,
        message: "nama hanya boleh menggunakan huruf dan angka",
      },
    });
  }

  next();
};

const updateValidation = async (req, res, next) => {
  const { nama } = req.body;
  const { id } = req.params;

  const findDevisi = await Devisi.findOne({
    where: {
      id: id,
    },
  });

  if (!findDevisi) {
    return res.status(404).json({
      meta: {
        status: 404,
        message: `Devisi dengan id ${id} tidak ditemukan`,
      },
    });
  }

  if (!nama) {
    next();
  } else {
    const testInput = /^[a-zA-Z0-9]+$/.test(nama);
    if (!testInput) {
      return res.status(400).json({
        meta: {
          status: 400,
          message: "nama hanya boleh menggunakan huruf dan angka",
        },
      });
    }
    const findDevisiName = await Devisi.findOne({
      where: {
        nama: nama,
      },
    });
    if (findDevisiName) {
      return res.status(400).json({
        meta: {
          status: 400,
          message: `Devisi dengan nama ${nama} telah di gunakan`,
        },
      });
    }
    next();
  }
};

const deleteValidation = async (req, res, next) => {
  const { id } = req.params;

  const findIdDevisi = await Devisi.findOne({
    where: {
      id: id,
    },
  });

  if (!findIdDevisi) {
    return res.status(404).json({
      meta: {
        status: 404,
        message: `Devisi dengan id ${id} tidak ditemukan`,
      },
    });
  }

  next();
};

module.exports = { createValidation, updateValidation, deleteValidation };
