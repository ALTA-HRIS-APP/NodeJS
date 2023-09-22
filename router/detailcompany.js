const express = require("express");
const { editCompanyDetail } = require("../controller/detailcompany");
const router = express.Router();

router.post("/detailcompany", editCompanyDetail);

module.exports = router;
