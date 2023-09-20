const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Devisi = db.devisi;
const Role = db.role;
cons company = db.company

const addEmployee = async (req, res) => {
  const {
    nama_lengkap,
    surel,
    no_hp,
    jabatan,
    devisiId,
    roleId,
    status,
    employee_status,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash("12345678", salt);

    await User.create({
      nama_lengkap,
      surel,
      no_hp,
      jabatan,
      kata_sandi: hashPassword,
      devisiId: devisiId || "b256efa8-56ea-11ee-9bcf-fcc1d3dbd38e",
      roleId,
      status: status || true,
      employee_status,
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

const editPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id; 
    const user = await User.findOne({ where: { id: userId } });
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.kata_sandi);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "Kata sandi lama salah" } });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await User.update(
      { kata_sandi: hashPassword },
      {
        where: { id: userId },
      }
    );

    return res
      .status(200)
      .json({ meta: { status: 200, message: "Kata sandi berhasil diubah" } });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ meta: { status: 500, message: "Terjadi kesalahan server" } });
  }
};

const getAll = async (req, res) => {
  try {
    const find = await User.findAll({
      include: [
        {
          model: Devisi,
          as: "devisi",
          attributes: ["nama"],
        },
        { model: Role, as: "role", attributes: ["nama"] },
      ],
      attributes: [
        "id",
        "nama_lengkap",
        "surel",
        "no_hp",
        "jabatan",
        "status",
        "employee_status",
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

const editRole = async (req, res) => {
  const { idUser } = req.query;
  const { roleId, jabatan } = req.body;

  try {
    await User.update(
      { roleId: roleId, jabatan: jabatan },
      {
        where: {
          id: idUser,
        },
      }
    );
    return res
      .status(200)
      .json({ meta: { status: 200, message: "Berhasil Edit Role User" } });
  } catch (error) {
    console.log(error);
  }
};

const changeUserDevisi = async (req, res) => {
  const { userId } = req.params; // ID pengguna yang akan diubah devisinya
  const { devisiId } = req.body; // ID devisi baru

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ meta: { status: 404, message: "Pengguna tidak ditemukan" } });
    }

    if (devisiId && user.devisiId === devisiId) {
      return res.status(400).json({
        meta: {
          status: 400,
          message: "Pengguna sudah berada di devisi yang sama",
        },
      });
    }

    const devisi = await Devisi.findByPk(devisiId);

    if (!devisi) {
      return res
        .status(404)
        .json({ meta: { status: 404, message: "Devisi tidak ditemukan" } });
    }

    user.devisiId = devisiId;
    await user.save();

    return res.status(200).json({
      meta: { status: 200, message: "Devisi pengguna berhasil diubah" },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ meta: { status: 500, message: "Terjadi kesalahan server" } });
  }
};

module.exports = {
  addEmployee,
  login,
  editPassword
  getAll,
  getUserbyId,
  getUserbyIdParams,
  editRole,
  changeUserDevisi
};
