const db = require("../models");
const { url } = require("./cloudinary");
const Role = db.role;
const User = db.user;
const Persdocs = db.persdocs;
const Devisi = db.devisi;

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

const editPasswordValidation = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    return res.status(400).json({
      meta: { status: 400, message: "Kata sandi lama harus diisi" },
    });
  }

  if (!newPassword) {
    return res.status(400).json({
      meta: { status: 400, message: "Kata sandi baru harus diisi" },
    });
  }

  next();
};

const addEmployeeValidation = async (req, res, next) => {
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

  const findRole = await Role.findOne({
    where: {
      id: roleId,
    },
  });

  if (findRole.nama === "superadmin") {
    if (jabatan !== "c-level") {
      return res.status(404).json({
        meta: { status: 404, message: "Role di peruntukkan jabatan c-level" },
      });
    }
  } else if (findRole.nama === "admin") {
    if (jabatan !== "manager" && jabatan !== "hr") {
      return res.status(404).json({
        meta: {
          status: 404,
          message: "Role di peruntukkan jabatan manager dan hr",
        },
      });
    }
  } else if (findRole.nama === "user") {
    if (jabatan !== "karyawan") {
      return res.status(404).json({
        meta: {
          status: 404,
          message: "Role di peruntukkan jabatan karyawan",
        },
      });
    }
  } else {
    return res
      .status(404)
      .json({ meta: { status: 404, message: "jabatan tidak ditemukan" } });
  }

  if (!employee_status) {
    return res
      .status(400)
      .json({ meta: { status: 400, message: "employee_status harus di isi" } });
  }

  const findDevisi = await Devisi.findOne({
    where: {
      id: devisiId,
    },
  });

  if (!findDevisi) {
    return res.status(404).json({
      meta: {
        status: 404,
        message: `Devisi dengan id ${devisiId} tidak ditemukan`,
      },
    });
  }

  next();
};

const editRoleValidation = async (req, res, next) => {
  const { idUser } = req.query;
  const { roleId, jabatan } = req.body;

  const findUser = await User.findOne({
    where: {
      id: idUser,
    },
  });

  if (!findUser) {
    return res
      .status(404)
      .json({ meta: { status: 404, message: "Karyawan tidak ditemukan" } });
  }
  const findRole = await Role.findOne({
    where: {
      id: roleId,
    },
  });

  if (!findRole) {
    return res
      .status(404)
      .json({ meta: { status: 404, message: "Role Tidak Ditemukan" } });
  }
  if (findRole.nama === "superadmin") {
    if (jabatan !== "c-level") {
      return res.status(404).json({
        meta: { status: 404, message: "Role di peruntukkan jabatan c-level" },
      });
    }
  } else if (findRole.nama === "admin") {
    if (jabatan !== "manager" || jabatan !== "hr") {
      return res.status(404).json({
        meta: {
          status: 404,
          message: "Role di peruntukkan jabatan manager dan hr",
        },
      });
    }
  } else if (findRole.nama === "user") {
    if (jabatan !== "karyawan") {
      return res.status(404).json({
        meta: {
          status: 404,
          message: "Role di peruntukkan jabatan karyawan",
        },
      });
    }
  } else {
    return res
      .status(404)
      .json({ meta: { status: 404, message: "jabatan tidak ditemukan" } });
  }

  next();
};

const validateDevisiChange = async (req, res, next) => {
  const { userId } = req.params;
  const { devisiId } = req.body;

  const findUser = await User.findOne({
    where: {
      id: idUser,
    },
  });

  if (!findUser) {
    return res
      .status(404)
      .json({ meta: { status: 404, message: "pengguna tidak ditemukan" } });
  }

  try {
    const user = req.user;
    if (devisiId && user.devisiId === devisiId) {
      return res.status(400).json({
        meta: {
          status: 400,
          message: "Pengguna sudah berada di devisi yang sama",
        },
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ meta: { status: 500, message: "Terjadi kesalahan server" } });
  }
};

const editPersDocsValidation = async (req, res, next) => {
  const { no_kk, no_npwp, no_bpjs } = req.body;
  const { url_kk, url_bpjs, url_npwp } = req.files;
  const { id } = req.params;

  const findUser = await User.findOne({
    where: {
      id: id,
    },
  });
  if (!findUser) {
    return res.status(404).json({
      meta: { status: 404, message: `User dengan id ${id} tidak ditemukan` },
    });
  }

  const findPersDocs = await Persdocs.findOne({
    where: {
      userId: findUser.id,
    },
  });

  if (!findPersDocs) {
    if (!no_kk) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "nomer kk harus di isi " } });
    } else if (!no_npwp) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "nomer npwp harus di isi " } });
    } else if (!no_bpjs) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "nomer bpjs harus di isi " } });
    }

    if (!url_kk) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "harus uploud file kk" } });
    } else if (!url_bpjs) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "harus uploud file bpjs" } });
    } else if (!url_npwp) {
      return res
        .status(400)
        .json({ meta: { status: 400, message: "harus uploud file npwp" } });
    }
    next();
  } else {
    next();
  }
};

const editUserValidation = async (req, res, next) => {
  const {
    nama_lengkap,
    alamat,
    no_hp,
    email,
    jabatan,
    password,
    status,
  } = req.body;

  if (!nama_lengkap) {
    return res.status(400).json({
      meta: { status: 400, message: "Nama lengkap harus diisi" },
    });
  }

  if (!alamat) {
    return res.status(400).json({
      meta: { status: 400, message: "Alamat harus diisi" },
    });
  }

  if (!no_hp) {
    return res.status(400).json({
      meta: { status: 400, message: "Nomor HP harus diisi" },
    });
  }

  if (!email) {
    return res.status(400).json({
      meta: { status: 400, message: "Email harus diisi" },
    });
  }

  if (!jabatan) {
    return res.status(400).json({
      meta: { status: 400, message: "Jabatan harus diisi" },
    });
  }

  if (password && !isValidPassword(password)) {
    return res.status(400).json({
      meta: {
        status: 400,
        message:
          "Kata sandi harus terdiri dari minimal 8 karakter, minimal 1 huruf kapital, minimal 1 angka, dan minimal 1 simbol",
      },
    });
  }

  if (status === undefined || status === null) {
    return res.status(400).json({
      meta: { status: 400, message: "Status harus diisi" },
    });
  }

  next();
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  loginValidation,
  addEmployeeValidation,
  editRoleValidation,
  editPasswordValidation,
  validateDevisiChange,
  editPersDocsValidation,
  editUserValidation,
};
