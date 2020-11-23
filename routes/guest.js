const express = require("express");
const router = express.Router();
const otpController = require("../controller/otpController")

router.post('/send-otp',otpController.sendLoginOtp)

module.exports = router;