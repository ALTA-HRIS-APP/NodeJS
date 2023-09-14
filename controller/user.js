const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;

const addEmployee = async (req, res) => {
  const { nama_lengkap, surel, no_hp, jabatan, kata_sandi, devisiId, roleId } =
    req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(kata_sandi, salt);

    await User.create({
      nama_lengkap,
      surel,
      no_hp,
      jabatan,
      kata_sandi: hashPassword,
      devisiId,
      roleId,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const findUser = await User.findOne({
      where: {
        [Op.or]: [{ email: username }, { username: username }],
      },
    });

    const match = await bcrypt.compare(password, findUser.password);
    if (!match) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "wrong password" } });
    }

    const usernames = findUser.username;
    const emails = findUser.email;
    const accessToken = jwt.sign(
      { usernames, emails },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600s" }
    );

    return res.status(200).json({
      meta: { status: 200, message: "Success" },
      data: { token: accessToken },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addEmployee, login };
