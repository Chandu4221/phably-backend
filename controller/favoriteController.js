const {
    changeStatus,
    getAll
} = require("../services/recipeFavorite/favoriteService")

module.exports = {    
    updateFavorite:async(req,res) => {
      try {
        ReS(res,await changeStatus(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Recipe Controller >>> create comment method");
      }
    },
    getAllFavorite:async(req,res) => {
      try {
        ReS(res,await getAll(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "Favorite Controller >>> get All Recipe");
      }
    },
  };
  