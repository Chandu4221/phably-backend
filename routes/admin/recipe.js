const express = require("express");
const router = express.Router();
const adminRecipeController = require("../../controller/admin/adminRecipeController")
const commentRoutes = require("./comment")

router.post("",adminRecipeController.getRecipes)
router.get("/:recipeId",adminRecipeController.getIndividualRecipe)
router.post("",adminRecipeController.updateBlockStatus)

router.use("/comment",commentRoutes)



module.exports = router