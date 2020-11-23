const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const recipeCommentSchema = new Schema(
    {
      createdByUser:{
        type:Schema.Types.ObjectId,ref:'User',
        required:[true,"User _id is required"]
      },
      recipeId:{
        type:Schema.Types.ObjectId,ref:'Recipe',
        required:[true,"Recipe _id is required"]
      },
      comment:{
          type:String,
          required:[true,"Recipe Comment is required"]
      },
      rating:{
        type:Number,
        required:[true,"Comment Rating is required"]
      },
      commentLike:[{
        type:Schema.Types.ObjectId,ref:'User'
      }],
      totalCommentLike:{
        type:Number,
        default:0
      }
    },
    { timestamps: true },
    { minimize: false }
  );
  
  
  
  module.exports = mongoose.model("RecipeComment", recipeCommentSchema);