const {
    createRecipe,
    createIngredient,
    createProcedure,
    updateProcedure,
    createRecipeComment,
    getRecipe,
    updateIngredient,
    deleteIngredient,
    updateRecipe,
    deleteRecipeImage,
    addRecipeImage,
    getRecipeImage,
    getAllRecipes
} = require("../services/recipe/recipeService")
const Recipe = require("../models/recipe")
const Ingredient = require("../models/ingredients")

module.exports = {    
    /**
     * ----------|| Recipe Create ||------------
     */
    createNewReceipe: async (req, res) => {
      try {
        ReS(res, await createRecipe(req), 200);
      } catch (error) {
        ReE(res, error, 422, "Recipe Controller >>> create method");
      }
    },

    deleteRecipeImage: async (req, res) => {
      try {
        ReS(res, await deleteRecipeImage(req), 200);
      } catch (error) {
        ReE(res, error, 422, "Recipe Controller >>> delete RecipeImage method");
      }
    },
    addRecipeImage: async (req, res) => {
      try {
        ReS(res, await addRecipeImage(req), 200);
      } catch (error) {
        ReE(res, error, 422, "Recipe Controller >>> delete RecipeImage method");
      }
    },
    
    
    createNewIngredient: async(req, res) => {
      try {
        ReS(res, await createIngredient(req), 200);
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create ingredient method");
      }
    },

    updateIngredient: async(req, res) => {
      try {
        ReS(res, await updateIngredient(req), 200);
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> update ingredient method");
      }
    },

    deleteIngredient: async(req, res) => {
      try {
        ReS(res, await deleteIngredient(req), 200);
      } catch (error) {
        ReE(res, error, 422, "Recipe Controller >>> Delete ingredient method");
      }
    },

    

    getAllIngredients: async(req, res) => {
      try {
        const {decoded} = req
        const allIngredients = await Ingredient.find({createdByUser:decoded._id})
        ReS(res,{data:{allIngredients}},200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create ingredient method");
      }
    },

    createNewProcedure:async (req, res) => {
      try {
        ReS(res, await createProcedure(req), 200);
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create step method");
      }
    },

    updateProcedure:async (req, res) => {
      try {
        ReS(res, await updateProcedure(req), 200);
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> update step method");
      }
    },
    deleteProcedure:async (req, res) => {
      try {
        ReS(res, await deleteProcedure(req), 200);
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> delete step method");
      }
    },

    
    
    ingredientSuggestion: async (req, res) => {
      try {
        const {q} = req.query
        let regex = new RegExp(q, 'i');
        const ingredientSuggestion = await Ingredient.find({"ingredientName":regex}).distinct('ingredientName');
        ReS(res,{data:{"suggestion":ingredientSuggestion}},200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> ingredientSuggestion method");
      }
    },
    getAllRecipes:async (req, res) => {
      try {
        ReS(res,await getAllRecipes(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },

    addCommentRecipe:async(req,res) => {
      try {
        ReS(res,await createRecipeComment(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },
    getIndividualRecipe:async(req,res) => {
      try {
        ReS(res,await getRecipe(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },
    updateRecipe:async(req,res) => {
      try {
        ReS(res,await updateRecipe(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> updateRecipe recipe method");
      }
    },
    getRecipeImage:async(req,res) => {
      try {
        ReS(res,await getRecipeImage(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> getRecipeImage recipe method");
      }
    },
  };
  