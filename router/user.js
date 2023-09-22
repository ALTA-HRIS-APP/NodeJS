const express = require("express");
const {
  login,
  addEmployee,
  editPassword,
  getAll,
  getUserbyId,
  getUserbyIdParams,
  editRole,
  changeUserDevisi,
  uploudPersDocs,
  updateStatusUser,
  editProfile,
} = require("../controller/user");
const {
  verifyToken,
  verifyTokenSuperAdmin,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const {
  loginValidation,
  addEmployeeValidation,
  editRoleValidation,
  editPasswordValidation,
  validateDevisiChange,
  editPersDocsValidation,
  editUserValidation,
} = require("../middleware/user");
const db = require("../models");
const uploud = require("../middleware/multer");
const multer = require("multer");
const router = express.Router();

router.post(`/user`, verifyTokenAdmin, addEmployeeValidation, addEmployee);
router.post("/login", loginValidation, login);
router.post("/editPassword", editPassword, editPasswordValidation);
router.get("/user", verifyTokenAdmin, getAll);
router.get("/profile", verifyToken, getUserbyId);
router.put("/user/role", verifyTokenSuperAdmin, editRoleValidation, editRole);
router.get("/user/:id", getUserbyIdParams);
router.put("/user/devisi", changeUserDevisi, validateDevisiChange);
router.put(
  "/persdocs/:id",
  verifyTokenAdmin,
  uploud.fields([
    { name: "url_kk", maxCount: 1 },
    { name: "url_bpjs", maxCount: 1 },
    { name: "url_npwp", maxCount: 1 },
  ]),
  editPersDocsValidation,
  uploudPersDocs,
  (err, req, res, next) => {
    // Tangani kesalahan pengunggahan di sini
    if (err instanceof multer.MulterError) {
      // Kesalahan Multer (misalnya, ukuran file terlalu besar)
      res.status(400).json({
        error: "Kesalahan pengunggahan: " + err.message,
      });
    } else {
      // Kesalahan lainnya (misalnya, filter yang tidak sesuai)
      res.status(400).json({
        meta: { status: 400, message: err.message },
      });
    }
  }
);
router.put("/user/status/:id", verifyTokenAdmin, updateStatusUser);
router.post("/editProfile", editProfile, editUserValidation,)

module.exports = router;
