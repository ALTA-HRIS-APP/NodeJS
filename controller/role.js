const db = require("../models");
const Role = db.role;

const getAll = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json({
      meta: { status: 200, message: "Berhasil ambil data" },
      data: roles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      meta: { status: 500, message: "Terjadi kesalahan saat mengambil data Devisi" },
    });
  }
};

const createRole = async (req, res) => {
  const { nama } = req.body;

  try {
    const newRole = await Role.create({ nama });
    return res.status(201).json({
      meta: { status: 201, message: "Berhasil membuat Role baru", data: newRole },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      meta: { status: 500, message: "Terjadi kesalahan saat membuat Role baru" },
    });
  }
};

const updateRole = async (req, res) => {
  const { nama } = req.body;
  const { id } = req.params;

  try {
    if (!nama) {
      return res.status(400).json({
        meta: {
          status: 400,
          message: "Nama Role tidak boleh kosong",
        },
      });
    }

    const roleToUpdate = await Role.findByPk(id);

    if (!roleToUpdate) {
      return res.status(404).json({
        meta: {
          status: 404,
          message: `Role dengan id ${id} tidak ditemukan`,
        },
      });
    }

    roleToUpdate.nama = nama;
    await roleToUpdate.save();

    return res.status(200).json({
      meta: {
        status: 200,
        message: `Berhasil update Role dengan id ${id}`,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      meta: { status: 500, message: "Terjadi kesalahan saat mengupdate Role" },
    });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const roleToDelete = await Role.findByPk(id);

    if (!roleToDelete) {
      return res.status(404).json({
        meta: {
          status: 404,
          message: `Role dengan id ${id} tidak ditemukan`,
        },
      });
    }

    await roleToDelete.destroy();

    return res.status(200).json({
      meta: { status: 200, message: "Berhasil hapus Role" },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      meta: { status: 500, message: "Terjadi kesalahan saat menghapus Role" },
    });
  }
};

module.exports = {
  getAll,
  createRole,
  updateRole,
  deleteRole,
};
