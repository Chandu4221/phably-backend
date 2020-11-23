const {
    getRecipes,
    getIndividualRecipe,
    getRecipeComments
  } = require("../../services/admin/adminService")
  
module.exports = {    
        /*
        This handler is use for the getting all users.
        */
      getRecipes:async(req,res) => {
        try {
            ReS(res,await getRecipes(req),200)
        } catch (error) {
          ReE(res, error, 422, "adminUserController Controller >>> get getRecipes method");
        }
      },
      /*
        This handler is use for getting information of recipe
      */
      getIndividualRecipe:async(req,res) => {
        try {
          ReS(res,await getIndividualRecipe(req),200)
        } catch (error) {
          ReE(res, error, 422, "adminUserController Controller >>> get getIndividualRecipe method");
        }
      },
      /*
        This handler is use for update block/unblock status recipe
      */
     updateBlockStatus:async(req,res) => {
       return {data:"Api Pending"}
      },

    /*
      This handler is use for getting comment of recipes
    */
     getComments:async(req,res) => {
      try {
        ReS(res,await getRecipeComments(req),200)
      } catch (error) {
        ReE(res, error, 422, "adminUserController Controller >>> get getComments method");
      }
    },
    /*
      This handler is use for deleting comment of recipes
    */
    deleteComment:async(req,res) => {
      try {
        ReS(res,await deleteRecipeComment(req),200)
      } catch (error) {
        ReE(res, error, 422, "adminUserController Controller >>> get deleteComment method");
      }
    },
}