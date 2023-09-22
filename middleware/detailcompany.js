const db = require("../models");
const Company = db.company;

const checkCompanyOwnership = async (req, res, next) => {
  try {
    const companyId = req.user.companyId; // Anggap req.user berisi informasi pengguna yang sedang masuk

    if (!companyId) {
      return res.status(403).json({
        meta: {
          status: 403,
          message: "Anda tidak memiliki izin untuk mengakses perusahaan ini",
        },
      });
    }

    const company = await Company.findOne({ where: { id: companyId } });

    if (!company) {
      return res.status(404).json({
        meta: { status: 404, message: "Perusahaan tidak ditemukan" },
      });
    }

    req.company = company; // Menyimpan informasi perusahaan dalam objek req
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      meta: { status: 500, message: "Terjadi kesalahan server" },
    });
  }
};

module.exports = {
  checkCompanyOwnership,
};
