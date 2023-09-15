const express = require("express");
const {
  login,
  addEmployee,
  getAll,
  getUserbyId,
} = require("../controller/user");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post(`/user`, addEmployee);
router.post("/user/login", login);
router.get("/user", getAll);
router.get("/profile", verifyToken, getUserbyId);

module.exports = router;
