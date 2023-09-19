const express = require("express");
const getAllDevisi = require("../controller/devisi");
const router = express.Router();

router.get("/devisi", getAllDevisi);

module.exports = router;
