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
      const userFavorite = await User.findById(userId).select('favoriteRecipes').populate({
        path: 'favoriteRecipes',
        select:"recipeName recipeMedia",
        populate: [{
          path: 'createdByUser',
          model: 'User',
          select: 'name profilePic'
         }],
         options: {
          limit: 10,
        },
      })

      return {data: {userFavorite}}
    }
    

    this.getAll = async({decoded,query}) => {
      const userId = decoded._id
      // const userFavorite = await User.findById(userId).select('favoriteRecipes').populate('favoriteRecipes','recipeName recipeMedia');
      // delete userFavorite._id

      const {page} = query

      
      var limit = parseInt(query.limit) || parseInt(process.env.PAGE_COUNT || 10);
      var skip = (parseInt(page)-1) * parseInt(limit);

      const userFavorite = await User.findById(userId).select('favoriteRecipes').populate({
        path: 'favoriteRecipes',
        select:"recipeName recipeMedia",
        populate: [{
          path: 'createdByUser',
          model: 'User',
          select: 'name profilePic'
         }],
         options: {
          limit: limit,
          skip: skip
        },
      })


      return {data: {userFavorite}}
    }

    return this;
  })();