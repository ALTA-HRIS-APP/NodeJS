const multer = require("multer");

function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
    return cb(
      new Error(
        "Hanya diperbolehkan mengunggah gambar (jpg, jpeg, png) atau file PDF"
      )
    );
  }
  cb(null, true);
}

const storage = multer.diskStorage({});
const uploud = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploud;
