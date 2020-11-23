const express = require("express");
const router = express.Router();
const { updateIngredient,createNewIngredient,ingredientSuggestion,deleteIngredient,getAllIngredients } = require("../controller/receipeController");
const checkToken = require("../middleware/checkToken")

router.get("/suggestion",checkToken,ingredientSuggestion)
router.post("",checkToken,createNewIngredient)
router.put("",checkToken,updateIngredient)
router.delete("/:recipeId/:ingredientId",checkToken,deleteIngredient)
router.get("/:recipeId",checkToken,getAllIngredients)


module.exports = router;