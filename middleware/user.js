const db = require("../models");
const User = db.user;

const loginValidation = async (req, res, next) => {
  const { email } = req.body;
  const findUser = await User.findOne({
    where: {
      surel: email,
    },
  });

  if (!findUser) {
    return res.status(404).json({
      meta: {
        status: 404,
        message: `user dengan email ${email} tidak ditemukan`,
      },
    });
  }

  next();
};

const addEmployeeValidation = async (req, res, next) => {
  const { nama_lengkap, surel, no_hp, jabatan, devisiId, roleId, status } =
    req.body;

  if (!nama_lengkap) {
    return res.status(400).json({
      meta: { status: 400, message: "nama lengkap tidak boleh kosong" },
    });
  }

  const findEmail = await User.findOne({
    where: {
      surel: surel,
    },
  });
  if (findEmail) {
    return res
      .status(400)
      .json({ meta: { status: 400, message: "Surel Telah Digunakan" } });
  }

  const cekSurel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(surel);
  if (!cekSurel) {
    return res
      .status(400)
      .json({ meta: { status: 400, message: "format surel tidak sesuai" } });
  }

  const checkNomer =
    /^(?:\+62|62|0)(?:8[1-9][0-9]|8[12][0-9]|8[23][0-9]|8[56][0-9]|8[789][0-9]|8[01][0-9]|2[12]9)\d{6,9}$/.test(
      no_hp
    );
  if (!checkNomer) {
    return res
      .status(400)
      .json({ meta: { status: 400, message: "nomor hp tidak sesuai" } });
  }

  if (!jabatan) {
    return res
      .status(400)
      .json({ meta: { status: 400, message: "jabatan tidak boleh kosong" } });
  }

  if (!roleId) {
    return res
      .status(400)
      .json({ meta: { status: 400, message: "role tidak boleh kosong" } });
  }

  next();
};

module.exports = { loginValidation, addEmployeeValidation };
