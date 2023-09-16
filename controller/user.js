const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Devisi = db.devisi;
const Role = db.role;

const addEmployee = async (req, res) => {
  const { nama_lengkap, surel, no_hp, jabatan, devisiId, roleId, status } =
    req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash("12345678", salt);

    await User.create({
      nama_lengkap,
      surel,
      no_hp,
      jabatan,
      kata_sandi: hashPassword,
      devisiId: devisiId || "a9b6efa2-52e7-11ee-89fb-a5765d73286f",
      roleId,
      status: status || true,
    });

    return res
      .status(200)
      .json({ meta: { status: 200, message: "Berhasil Tambah Karyawan" } });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({
      where: {
        surel: email,
      },
      include: [{ model: Role, as: "role" }],
    });
    const match = await bcrypt.compare(password, findUser.kata_sandi);
    if (!match) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "wrong password" } });
    }
    const emails = findUser.surel;
    const id = findUser.id;
    const role = findUser.role.nama;
    const accessToken = jwt.sign(
      { emails, id, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "600s",
      }
    );

    return res.status(200).json({
      meta: { status: 200, message: "Success" },
      data: { token: accessToken },
    });
  } catch (error) {
    console.log(error);
  }
};

const getAll = async (req, res) => {
  try {
    const find = await User.findAll({
      include: [
        {
          model: Devisi,
          as: "devisi",
        },
        { model: Role, as: "role" },
      ],
    });

    return res
      .status(200)
      .json({ meta: { status: 200, message: "Success", data: find } });
  } catch (error) {
    console.log(error);
  }
};

const getUserbyId = async (req, res) => {
  try {
    const findbyId = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Devisi,
          as: "devisi",
        },
        { model: Role, as: "role" },
      ],
    });
    return res.status(200).json({
      meta: { status: 200, message: "Success get User by Id" },
      data: findbyId,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ meta: { status: 404, message: "User NotFound" } });
  }
};

const getUserbyIdParams = async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await User.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Devisi,
          as: "devisi",
        },
        { model: Role, as: "role" },
      ],
    });

    if (!findUser) {
      return res
        .status(404)
        .json({ meta: { status: 404, message: "User Tidak Ditemukan" } });
    } else {
      return res
        .status(200)
        .json({ meta: { status: 200, message: "Berhasil" }, data: findUser });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addEmployee, login, getAll, getUserbyId, getUserbyIdParams };
