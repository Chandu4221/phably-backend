const {
    createRecipeComment,
    getRecipeComments,
    deleteRecipeComments,
    addCommentLike
} = require("../services/recipeComment/recipeCommentService")
const Recipe = require("../models/recipe")
const Ingredient = require("../models/ingredients")

module.exports = {    
    addComment:async(req,res) => {
      try {
        ReS(res,await createRecipeComment(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },
    addCommentLike: async(req, res) => {
      try {
        ReS(res,await addCommentLike(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> addCommentLike method");
      }
    },
    getComments:async(req,res) => {
      try {
        ReS(res,await getRecipeComments(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },
    updateComments:async(req,res) => {
      try {
        ReS(res,await updateRecipeComments(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },
    deleteComments:async(req,res) => {
      try {
        ReS(res,await deleteRecipeComments(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },
  };
  