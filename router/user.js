const express = require("express");
const { login, addEmployee } = require("../controller/user");
const router = express.Router();

router.post(`/`, addEmployee);
router.post("/login", login);

module.exports = router;
