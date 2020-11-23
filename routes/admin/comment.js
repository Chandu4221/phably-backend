const express = require("express");
const router = express.Router();
const adminRecipeController = require("../../controller/admin/adminRecipeController")

router.get("/:recipeId",adminRecipeController.getComments)
router.delete("/:commentId",adminRecipeController.deleteComment)


module.exports = router