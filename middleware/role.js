const db = require("../models");
const Role = db.role;

const createValidation = async (req, res, next) => {
  const { nama } = req.body;

  const findRole = await Role.findOne({
    where: {
      nama: nama,
    },
  });
  if (findRole) {
    return res.status(400).json({
      meta: {
        status: 400,
        message: `role dengan nama ${nama} telah di gunakan`,
      },
    });
  }

  if (!nama) {
    return res.status(400).json({
      meta: { status: 400, message: "Nama role tidak boleh kosong" },
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

  const findRole = await Role.findOne({
    where: {
      id: id,
    },
  });

  if (!findRole) {
    return res.status(404).json({
      meta: {
        status: 404,
        message: `Role dengan id ${id} tidak ditemukan`,
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
    const findRoleName = await Role.findOne({
      where: {
        nama: nama,
      },
    });
    if (findRoleName) {
      return res.status(400).json({
        meta: {
          status: 400,
          message: `Role dengan nama ${nama} telah di gunakan`,
        },
      });
    }
    next();
  }
};

const deleteValidation = async (req, res, next) => {
  const { id } = req.params;

  const findIdRole = await Role.findOne({
    where: {
      id: id,
    },
  });

  if (!findIdRole) {
    return res.status(404).json({
      meta: {
        status: 404,
        message: `Role dengan id ${id} tidak ditemukan`,
      },
    });
  }

  next();
};

module.exports = { createValidation, updateValidation, deleteValidation };
