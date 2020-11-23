const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    createdByUser:{
      type:Schema.Types.ObjectId,ref:'User',
      required:[true,"User _id is required"]
    },
    recipeMedia:
      {
        recipeMediaType:{
          type:String,
        },
        recipeMediaUrl:{
          type:String,
        }
      }
    ,
    recipeName: {
      type: String,
      require:[true,"Recipe Name is required"]
    },
    serves:{
        type: Number,
        required:[true,"Serves is required"]
    },
    servesType:{
      type: Number,
      enum: [1,2],
      required:[true,"Serves Type is required"]
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
    recipeComment:[{
      type:Schema.Types.ObjectId,ref:'RecipeComment'
    }],
    recipeBlocked:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true },
  { minimize: false }
);




module.exports = mongoose.model("Recipe", recipeSchema);
