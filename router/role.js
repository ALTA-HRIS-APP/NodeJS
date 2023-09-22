const express = require("express");
const {
    getAll,
    createRole,
    updateRole,
    deleteRole
} = require ("../controller/role")
const {
  createValidation,
  updateValidation,
  deleteValidation,
} = require("../middleware/role");
const { verifyTokenSuperAdmin } = require("../middleware/verifyToken");
const router = express.Router();

router.get("/role", getAll);
router.post("/role", verifyTokenSuperAdmin, createValidation, createRole);
router.put(
  "/role/:id",
  verifyTokenSuperAdmin,
  updateValidation,
  updateRole
);
router.delete(
  "/role/:id",
  verifyTokenSuperAdmin,
  deleteValidation,
  deleteRole
);

module.exports = router;
