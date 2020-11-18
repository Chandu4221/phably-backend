const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    createdByUser:{
      type:Schema.Types.ObjectId,ref:'User',
      required:[true,"User _id is required"]
    },
    recipeMedia:[
      {
        recipeMediaType:{
          type:String,
        },
        recipeMediaUrl:{
          type:String,
        }
      }
    ],
    recipeName: {
      type: String,
      require:[true,"Recipe Name is required"]
    },
    serves:{
        type: Number,
        required:[true,"Serves is required"]
    },
    cookTime:{
      type:String,
      required:[true,"Cook Time is required"]
    },
    prepTime:{
      type:String,
      required:[true,"Prepration Time is required"]
    },
    ingredients:[
      {
        type:Schema.Types.ObjectId,ref:'Ingredient'
      },
    ],
    recipeStep:[
      {
        type:Schema.Types.ObjectId,ref:'RecipeStep'
      },
    ],
  },
  { timestamps: true },
  { minimize: false }
);



module.exports = mongoose.model("Recipe", recipeSchema);
