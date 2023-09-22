const express = require("express");
const router = express.Router();
const { checkCompanyOwnership } = require("../middleware/detailcompany");
const { editCompanyDetail } = require("../controller/detailcompany")

router.put("/edit", checkCompanyOwnership, editCompanyDetail);

module.exports = router;
