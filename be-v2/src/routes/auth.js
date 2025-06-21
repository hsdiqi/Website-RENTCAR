const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/admin/login", authController.loginAdmin);
router.post("/admin/register", authController.registerAdmin);

module.exports = router;