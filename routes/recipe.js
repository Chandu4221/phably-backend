const express = require("express");
const router = express.Router();
const { createNewReceipe,getIndividualRecipe,getAllRecipes,updateRecipe,deleteRecipeImage,addRecipeImage,getRecipeImage,getRecipeSuggestions } = require("../controller/receipeController");
const {updateFavorite,getAllFavorite} = require("../controller/favoriteController")
const checkToken = require("../middleware/checkToken")
const ingredientRoutes = require("./ingredient")
const stepRoutes = require("./step")
const recipeCommentRoutes = require("./recipeComment");

router.get("/suggestion",checkToken,getRecipeSuggestions)
router.use("/comment",checkToken,recipeCommentRoutes);

router.get("/favorite",checkToken,getAllFavorite)
router.post("/favorite",checkToken,updateFavorite)

router.get("/:recipeId",checkToken,getIndividualRecipe)

router.put("",checkToken,updateRecipe)
router.post("",checkToken, createNewReceipe);
router.get("",checkToken,getAllRecipes)

router.delete("/recipe-media/:recipeId/:recipeImageId",checkToken,deleteRecipeImage)
router.put("/recipe-media/:recipeId",checkToken,addRecipeImage);
router.get("/recipe-media/:recipeId",checkToken,getRecipeImage);


router.use("/ingredient",checkToken,ingredientRoutes);
router.use("/step",checkToken,stepRoutes);


module.exports = router;