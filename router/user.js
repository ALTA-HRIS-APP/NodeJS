const express = require("express");
const {
  login,
  addEmployee,
  editPassword
  getAll,
  getUserbyId,
  getUserbyIdParams,
  editRole,
  changeUserDevisi,
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
  validateDevisiChange
} = require("../middleware/user");
const db = require("../models");
const router = express.Router();

router.post(`/user`, verifyTokenAdmin, addEmployeeValidation, addEmployee);
router.post("/login", loginValidation, login);
router.post("/editPassword", editPassword, editPasswordValidation);
router.get("/user", getAll);
router.get("/profile", verifyToken, getUserbyId);
router.put("/user/role", verifyTokenSuperAdmin, editRoleValidation, editRole);
router.get("/user/:id", getUserbyIdParams);
router.put("/user/devisi", changeUserDevisi, validateDevisiChange);

module.exports = router;
