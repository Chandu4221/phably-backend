const express = require("express");
const router = express.Router();
const { updateIngredient,createNewIngredient,ingredientSuggestion,deleteIngredient } = require("../controller/receipeController");
const checkToken = require("../middleware/checkToken")

router.post("/:recipeId",checkToken,createNewIngredient)
router.put("/:recipeId",checkToken,updateIngredient)
router.delete("/:recipeId/:ingredientId",checkToken,deleteIngredient)
router.get("/suggestion",checkToken,ingredientSuggestion)


module.exports = router;