const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const recipeRouter = require("./recipe");
const chatRouter = require("./chat");


router.use("/users", usersRouter);

router.use("/recipe", recipeRouter);
router.use("/chat",chatRouter);


module.exports = router