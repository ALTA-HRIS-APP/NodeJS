const express = require("express");
const {
  login,
  addEmployee,
  getAll,
  getUserbyId,
  getUserbyIdParams,
  editRole,
} = require("../controller/user");
const {
  verifyToken,
  verifyTokenSuperAdmin,
} = require("../middleware/verifyToken");
const {
  loginValidation,
  addEmployeeValidation,
  editRoleValidation,
} = require("../middleware/user");
const router = express.Router();

router.post(`/user`, addEmployeeValidation, addEmployee);
router.post("/login", loginValidation, login);
router.get("/user", getAll);
router.get("/profile", verifyToken, getUserbyId);
router.put("/user/role", verifyTokenSuperAdmin, editRoleValidation, editRole);
router.get("/user/:id", getUserbyIdParams);

module.exports = router;
