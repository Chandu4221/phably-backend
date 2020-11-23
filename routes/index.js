const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const recipeRouter = require("./recipe");
const chatRouter = require("./chat");
const friendRouter = require("./friend");
const circleRouter = require("./circle");

const adminRouter = require("./admin");
const superAdminRouter = require("./superadmin")
const guestRouter = require("./guest");

router.use("/",guestRouter);
router.use("/users", usersRouter);
router.use("/recipe", recipeRouter);
router.use("/chat",chatRouter);
router.use("/friend",friendRouter);
router.use("/circle",circleRouter);



router.use("/admin",adminRouter);
router.use("/superadmin",superAdminRouter);


module.exports = router