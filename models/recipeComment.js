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
    },
    { timestamps: true },
    { minimize: false }
  );
  
  
  
  module.exports = mongoose.model("RecipeComment", recipeCommentSchema);