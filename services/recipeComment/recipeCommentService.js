const mongoose = require("mongoose");

const Recipe = require("../../models/recipe")
const RecipeComment = require("../../models/recipeComment");

module.exports = (function () {

    this.getRecipeComments = async ({params,query}) => {
      const {recipeId} = params
      const {page} = query

      
      var limit = parseInt(query.limit) || parseInt(process.env.PAGE_COUNT || 10);
      var skip = (parseInt(page)-1) * parseInt(limit);

      const recipeComment = await Recipe.findById(recipeId).select("recipeComment").populate({ 
        path: 'recipeComment',
        select:"comment rating createdAt updatedAt",
        options: {
          limit: limit,
          skip: skip
        },
        populate: [{
         path: 'createdByUser',
         model: 'User',
         select: 'name profilePic'
        }] 
     })
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
    this.addCommentLike = async ({body,decoded}) => {
      // get the varibles
      const {commentId,status} = body
      const userId = decoded._id

      if(!commentId || !status)
        throw new Error("Comment Id and status must be provided")

      // check if comment is available
      const comment = await RecipeComment.findById(commentId)
      if(!comment){
        throw new Error("Comment not found")
      }
      if(status == "true"){
        await comment.updateOne({ '$addToSet': {'commentLike':userId} })
        comment.totalCommentLike = comment.commentLike.length
      }else{
        
        comment.totalCommentLike = comment.commentLike.pull(userId).length
      }

      await comment.save()
      // update the comment
      const totalCommentLike = await RecipeComment.aggregate
        ([
        { "$match": { "_id": new mongoose.Types.ObjectId(commentId) } },
        {$project: {totalLikes: {$size: '$commentLike'}}}
      ])
      return {data:{totalCommentLike,"message":"Comment Like Updated"}}
    }

    this.updateRecipeComments = async ({body,decoded}) => {
      try{
        const {comment,commentId,rating} = body
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

        if(comment){
          recipeComment.comment = comment
        }
        if(rating){
          recipeComment.rating = rating
        }
        await recipeComment.save();

        // get all comment by the createby 
        // const allRecipeComments = await RecipeComment.find({recipeId}).sort("-updatedAt").limit(20);
        return {data:{message:"Comment Updated"}}
      }catch(error){
        TE(error);
      }


      return {data:body}
    } 
    this.createRecipeComment = async ({body,decoded}) => {
      try{
        const {comment,recipeId,rating} = body
        const userId = decoded._id

        //check if data avaible in 
        if(!recipeId || !comment || !userId || !rating){
           throw new Error("Validation Error, recipeId,rating, userId,comment is required",400)
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
          recipeId,
          rating
        })

        await newRecipeComment.save()
        recipe.recipeComment.push(newRecipeComment._id)
        recipe.save()
        
        return {data:{message:"New Comment Added"}}
      }catch(error){
        TE(error);
      }
    }
    return this;
  })();