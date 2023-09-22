const multer = require("multer");

function fileFilter(req, file, cb) {
  if (file && file.originalname) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      // Berkas tidak sesuai dengan ekstensi yang diizinkan
      // Panggil callback dengan kesalahan
      cb(
        new Error(
          "Hanya diperbolehkan mengunggah gambar (jpg, jpeg, png) atau file PDF"
        ),
        false
      );
    } else {
      // Berkas sesuai dengan ekstensi yang diizinkan
      cb(null, true);
    }
  } else {
    // Handle kasus di mana 'file' atau 'originalname' tidak terdefinisi
    cb(new Error("File tidak valid"), false);
  }
}

const storage = multer.diskStorage({});
const uploud = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploud;
