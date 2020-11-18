const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeStepScheme = new Schema({
  // stepMedia:{
  //   type:String,
  // },
  // stepMediaType:{
  //   type: String, enum: ["image","videa","gif"]
  // },
  createdByUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  procedureTitle:{
    type:String,
    required:[true,"Procedure Title is Required"],
  },
  procedureDetails:{
    type:String,
    required:[true,"Procedure Detials is Required"],
  },
});

module.exports = mongoose.model("RecipeStep", recipeStepScheme)

