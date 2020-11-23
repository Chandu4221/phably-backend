const express = require("express");
const router = express.Router();
const adminToken = require("../middleware/adminToken")
const adminController = require("../controller/adminController")
const userRoute = require("./admin/user")
const recipeRoute = require("./admin/recipe")

router.use('/user',adminToken,userRoute)
router.use('/recipe',adminToken,recipeRoute)



router.post("/login",adminController.loginAdmin)


module.exports = router