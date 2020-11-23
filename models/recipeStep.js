const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeStepScheme = new Schema({
  recipeStepMedia:
    {
      recipeStepMediaType:{
        type:String,
      },
      recipeStepMediaUrl:{
        type:String,
      }
   },
  createdByUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stepName:{
    type:String,
    required:[true,"Step Name is Required"],
  },
  stepIntructions:{
    type:String,
    required:[true,"Step Intructions is Required"],
  },
  stepPersonalTouch:{
    type:String,
  },
});

module.exports = mongoose.model("RecipeStep", recipeStepScheme)

