const express = require("express");
const router = express.Router();
const { createNewReceipe,getIndividualRecipe,getAllRecipes,updateRecipe,deleteRecipeImage,addRecipeImage,getRecipeImage } = require("../controller/receipeController");
const {updateFavorite,getAllFavorite} = require("../controller/favoriteController")
const checkToken = require("../middleware/checkToken")
const ingredientRoutes = require("./ingredient")
const stepRoutes = require("./step")
const recipeCommentRoutes = require("./recipeComment");

router.get("/:recipeId",checkToken,getIndividualRecipe)
router.get("",checkToken,getAllRecipes)

router.put("/:recipeId",checkToken,updateRecipe)
router.post("",checkToken, createNewReceipe);

router.delete("/recipe-media/:recipeId/:recipeImageId",checkToken,deleteRecipeImage)
router.put("/recipe-media/:recipeId",checkToken,addRecipeImage);
router.get("/recipe-media/:recipeId",checkToken,getRecipeImage);



router.post("/favorite",checkToken,updateFavorite)
router.get("/favorite",checkToken,getAllFavorite)



router.use("/ingredient",checkToken,ingredientRoutes);
router.use("/step",checkToken,stepRoutes);
router.use("/comment",checkToken,recipeCommentRoutes);


module.exports = router;