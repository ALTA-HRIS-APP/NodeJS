const express = require("express");
const {
  login,
  addEmployee,
  getAll,
  getUserbyId,
} = require("../controller/user");
const verifyToken = require("../middleware/verifyToken");
const {
  loginValidation,
  addEmployeeValidation,
} = require("../middleware/user");
const router = express.Router();

router.post(`/user`, addEmployeeValidation, addEmployee);
router.post("/login", loginValidation, login);
router.get("/user", getAll);
router.get("/profile", verifyToken, getUserbyId);

module.exports = router;
