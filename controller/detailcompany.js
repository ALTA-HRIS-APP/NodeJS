const db = require("../models");
const Company = db.company; 

const editCompanyDetail = async (req, res) => {
  const { nama_company, url_logo } = req.body;

  try {
    const companyId = req.user.companyId; 
    const company = await Company.findOne({ where: { id: companyId } });

    if (!company) {
      return res
        .status(404)
        .json({ meta: { status: 404, message: "Perusahaan tidak ditemukan" } });
    }

    if (nama_company) {
      // Pastikan nama perusahaan tidak mengandung simbol
      if (/[!@#$%^&*(),.?":{}|<>]/.test(nama_company)) {
        return res.status(400).json({
          meta: {
            status: 400,
            message: "Nama perusahaan tidak boleh mengandung simbol",
          },
        });
      }

      company.nama_company = nama_company;
    }

    if (url_logo) {
      const allowedExtensions = ["jpg", "png"];
      const fileExtension = url_logo.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({
          meta: {
            status: 400,
            message: "Format logo harus jpg atau png",
          },
        });
      }

      company.url_logo = url_logo;
    }
    await company.save();

    return res.status(200).json({
      meta: { status: 200, message: "Detail perusahaan berhasil diubah" },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ meta: { status: 500, message: "Terjadi kesalahan server" } });
  }
};

module.exports = {
  editCompanyDetail,
};
