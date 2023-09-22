const express = require("express");
const {
  getAllDevisi,
  createDevisi,
  updateDevisi,
  deleteDevisi,
  getdevisibyid,
} = require("../controller/devisi");
const {
  createValidation,
  updateValidation,
  deleteValidation,
} = require("../middleware/devisi");
const { verifyTokenSuperAdmin } = require("../middleware/verifyToken");
const router = express.Router();

router.get("/devisi", getAllDevisi);
router.post("/devisi", verifyTokenSuperAdmin, createValidation, createDevisi);
router.put(
  "/devisi/:id",
  verifyTokenSuperAdmin,
  updateValidation,
  updateDevisi
);
router.delete(
  "/devisi/:id",
  verifyTokenSuperAdmin,
  deleteValidation,
  deleteDevisi
);
router.get("/devisi/:id", getdevisibyid);

module.exports = router;
