const express = require("express");
const getAll = require("../controller/role");
const router = express.Router();

router.get("/role", getAll);

module.exports = router;
