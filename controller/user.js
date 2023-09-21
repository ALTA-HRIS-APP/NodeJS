const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const fs = require("fs");
const cloudinary = require("../middleware/cloudinary");
const CryptoJS = require("crypto-js");
const User = db.user;
const Devisi = db.devisi;
const Role = db.role;
const company = db.company;
const Persdocs = db.persdocs;

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
        expiresIn: "1h",
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
        { model: Persdocs, as: "persdocs" },
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

const uploudPersDocs = async (req, res) => {
  const { no_kk, no_npwp, no_bpjs } = req.body;
  const { url_kk, url_bpjs, url_npwp } = req.files;
  const { id } = req.params;
  console.log(id);

  try {
    const findUser = await User.findOne({
      where: {
        id: id,
      },
    });
    function generateFileName(file) {
      const timestamp = Date.now();
      const randomString = CryptoJS.lib.WordArray.random(10 / 2).toString(
        CryptoJS.enc.Hex
      );
      const originalFileName = file[0].originalname.replace(/\s/g, "_");
      const safeFileName = `${timestamp}_${randomString}_${originalFileName}`;
      return safeFileName.replace(/\.[^.]*$/, "");
    }

    const findPersdocs = await Persdocs.findOne({
      where: {
        userId: findUser.id,
      },
    });

    if (!findPersdocs) {
      const filesToUpload = [
        {
          path: url_npwp,
          name: "npwp",
        },
        {
          path: url_kk,
          name: "kk",
        },
        {
          path: url_bpjs,
          name: "bpjs",
        },
      ];

      const imageUrl = {};
      for (const file of filesToUpload) {
        const uploud = await cloudinary.uploader.upload(file.path[0].path, {
          folder: "project2",
          public_id: `${file.name}/${findUser.nama_lengkap}_${generateFileName(
            file.path
          )}`,
          overwrite: true,
        });
        let imageUrls = {
          url: uploud.secure_url,
          idPublic: uploud.public_id,
        };
        const folders = file.path[0].fieldname.split("/")[0];
        imageUrl[folders] = imageUrls;
        fs.unlinkSync(file.path[0].path);
      }
      await Persdocs.create({
        no_kk: no_kk,
        no_npwp: no_npwp,
        no_bpjs: no_bpjs,
        url_kk: imageUrl.url_kk,
        url_bpjs: imageUrl.url_bpjs,
        url_npwp: imageUrl.url_npwp,
        userId: findUser.id,
      });
    } else {
      let url = [
        {
          url: !url_kk ? "" : JSON.parse(findPersdocs.url_kk).idPublic,
          file: url_kk || "",
        },
        {
          url: !url_npwp ? "" : JSON.parse(findPersdocs.url_npwp).idPublic,
          file: url_npwp || "",
        },
        {
          url: !url_bpjs ? "" : JSON.parse(findPersdocs.url_bpjs).idPublic,
          file: url_bpjs || "",
        },
      ];
      const imageUrl = {};

      for (const urls of url) {
        if (urls.url.length !== 0) {
          cloudinary.uploader.destroy(urls.url, (error, result) => {
            if (error) {
              console.error("Error deleting image:", error);
            } else {
              console.log("Image deleted successfully");
            }
          });

          const uploud = await cloudinary.uploader.upload(urls.file[0].path, {
            folder: "project2",
            public_id: `${urls.file[0].fieldname.split("_")[1]}/${
              findUser.nama_lengkap
            }_${generateFileName([urls.file[0]])}`,
            overwrite: true,
          });
          let imageUrls = {
            url: uploud.secure_url,
            idPublic: uploud.public_id,
          };
          const folders = urls.file[0].fieldname;
          imageUrl[folders] = imageUrls;
          fs.unlinkSync(urls.file[0].path);

          if (folders === "url_kk") {
            await Persdocs.update(
              {
                url_kk: imageUrl.url_kk || findPersdocs.url_kk,
              },
              {
                where: {
                  id: findPersdocs.id,
                },
              }
            );
          } else if (folders === "url_npwp") {
            await Persdocs.update(
              {
                url_npwp: imageUrl.url_npwp || findPersdocs.url_npwp,
              },
              {
                where: {
                  id: findPersdocs.id,
                },
              }
            );
          } else if (folders === "url_bpjs") {
            await Persdocs.update(
              {
                url_bpjs: imageUrl.url_bpjs || findPersdocs.url_bpjs,
              },
              {
                where: {
                  id: findPersdocs.id,
                },
              }
            );
          }
        }
      }

      await Persdocs.update(
        {
          no_kk: no_kk || findPersdocs.no_kk,
          no_npwp: no_npwp || findPersdocs.no_npwp,
          no_bpjs: no_bpjs || findPersdocs.no_bpjs,
        },
        {
          where: {
            id: findPersdocs.id,
          },
        }
      );
    }

    return res
      .status(200)
      .json({ meta: { status: 200, message: "Berhasil update docs user" } });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addEmployee,
  login,
  editPassword,
  getAll,
  getUserbyId,
  getUserbyIdParams,
  editRole,
  changeUserDevisi,
  uploudPersDocs,
};
