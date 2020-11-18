const mongoose = require("mongoose");

const Recipe = require("../../models/recipe")
const RecipeComment = require("../../models/recipeComment");

module.exports = (function () {

    this.getRecipeComments = async ({params,query}) => {
      const {recipeId} = params
      const {page} = query

      var limit = parseInt(process.env.RECIPE_COMMENT_PAGE);
      var skip = (parseInt(page)-1) * parseInt(limit);

      const recipeComment = await RecipeComment.find({recipeId}).select("createdByUser comment updatedAt").populate("createdByUser",'name').sort("-updatedAt").skip(skip).limit(limit)
      return {data:{recipeComment}}
    }
    this.deleteRecipeComments = async ({params}) => {
      //get the commentId
      const {commentId} = params


      //check if exists
      const recipeCommentDelete = await RecipeComment.findById(commentId).deleteOne()
      console.log(recipeCommentDelete)
      //if delete than send success message
      if(recipeCommentDelete.deletedCount == 1)
        return {data:{"message":"Recipe Comment Deleted"}}
      else
        throw new Error("Error occurred while deleting recipe comment")
    }

    this.updateRecipeComments = async ({body,decoded}) => {
      try{
        const {comment,commentId} = body
        const userId = decoded._id

        //check if data avaible in 
        if(!comment || !userId || !commentId){
           throw new Error("Validation Error",400)
        }


        //check if recipe comment Exists
        let recipeComment = await RecipeComment.findById({_id: commentId});
        if(!recipeComment){
          throw new Error("Cannot Found Recipe Comment")
        }

        recipeComment.comment = comment
        recipeComment.save();

        // get all comment by the createby 
        // const allRecipeComments = await RecipeComment.find({recipeId}).sort("-updatedAt").limit(20);
        return {data:{message:"Comment Updated"}}
      }catch(error){
        TE(error);
      }


      return {data:body}
    } 

    this.createRecipeComment = async ({params,body,decoded}) => {
      try{
        const {recipeId} = params
        const {comment} = body
        const userId = decoded._id
        //check if data avaible in 
        if(!recipeId || !comment || !userId){
           throw new Error("Validation Error",400)
        }

        //check if recipe Exists
        let recipe = await Recipe.findById({_id: recipeId});
        if(!recipe){
          throw new Error("Cannot Found Recipe")
        }
        //add new comment in recipe
        const newRecipeComment = new RecipeComment({
          createdByUser:userId,
          comment,
          recipeId
        })

        await newRecipeComment.save()
        
        return {data:{message:"New Comment Added"}}
      }catch(error){
        TE(error);
      }
    }
    
    return this;
  })();