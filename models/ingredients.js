const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
  {
    ingredientName: {
      type: String,
      require:[true,"Ingredient Name is required"]
    },
    ingredientQuality:{
        type: Number,
        required:[true,"Ingredient Quality is required"]
    },
    ingredientMeasure:{
        type: String,
        required:[true,"Ingredient Measure is required"]
    },
  },
  { timestamps: true },
  { minimize: false }
);



module.exports = mongoose.model("Ingredient", ingredientSchema)