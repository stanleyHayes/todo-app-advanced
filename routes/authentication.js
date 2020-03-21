const express = require("express");
const {protect} = require("../middlewares/authentication");
const router = express.Router();

const {changePassword, login, register, resetPassword, forgotPassword, getMe} = require("../controllers/authentication");

router.post("/register", register);

router.post("/login", login);

router.put("/reset-password/:resetToken", resetPassword);

router.put("/change-password", protect, changePassword);

router.post("/forgot-password", forgotPassword);

router.get("/me", protect, getMe);

module.exports = router;
