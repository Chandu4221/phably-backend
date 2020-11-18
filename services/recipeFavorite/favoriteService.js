const User = require('../../models/user')
const Recipt = require('../../models/recipe')
module.exports = (function () {
    /**
     * @params request, response
     * @For changing status of receipt
     */
    this.changeStatus = async ({body,decoded}) => {
      const {recipeId,status} = body
      const userId = decoded._id
      if(!recipeId || status == null){
        throw new Error('Validation Error')
      }

      const user = await User.findById(userId)

      if(!user){
        throw new Error('Cannot Found User')
      }

      const recipe = await Recipt.findById(recipeId)

      if(!recipe){
        throw new Error('Cannot Found Recipt')
      }

      if(status == true){
        await user.update({$addToSet:{'favoriteRecipes':recipeId}})
      }else{
        await user.update({$pull:{'favoriteRecipes':recipeId}})
      }
      await user.save()
      const userFavorite = await User.findById(userId).select('favoriteRecipes').populate('favoriteRecipes','recipeName recipeMedia')

      return {data: {userFavorite}}
    }
    

    this.getAll = async({decoded}) => {
      const userId = decoded._id
      const userFavorite = await User.findById(userId).select('favoriteRecipes');
      return {data: {userFavorite}}
    }

    return this;
  })();