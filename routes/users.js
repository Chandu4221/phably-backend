const express = require("express");
const router = express.Router();


const friendRoute = require("./friend")
const circleRoute = require("./circle")
const {
    create,
    sendOtp,
    login,
    userProfileUpdate,
    userDetails,
    otherUserDetails
  } = require("../controller/userController");
const checkToken = require('../middleware/checkToken');

router.use('/friend',friendRoute)
router.use('/circle',circleRoute)

// router.post("/signup", create);
router.post("/signin", login);
router.post("/send-otp", sendOtp);
router.put("",checkToken,userProfileUpdate);
router.get("",checkToken,userDetails)
router.get("/:userId",checkToken,otherUserDetails)






module.exports = router;