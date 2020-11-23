const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    name: {
      type: String,
      default:""
    },
    profilePic:{
      type: String,
      default:""
    },
    email:{
      type: String,
      default:""
    },
    phoneNumber:{
      type: String,
      default:""
    },
    loginText: {
      type: String,
      unique: [true, "Login Text is already exists."],
    },
    loginToken: {
      type: String,
      default:""
    },
    fcmToken: {
      type: String,
      default:""
    },
    phoneNumber: {
      type: String,
    },
    email: {
        type: String,
    },
    verificationCode: {
      type: String,
      default:null
    },
    whichRecipe:{
      type: String,
      default:"",
    },
    gender:{
      type: String,
      enum: ["male","female",""],
      default:"",
    },
    userBlocked: {
      type: Boolean,
      default: false,
    },
    favoriteRecipes:[
      {
        type:Schema.Types.ObjectId,
        ref:'Recipe'
      }
    ],
    friends:[
      {
        type:Schema.Types.ObjectId,
        ref:'User'
      }
    ],
    recipes:[
      {
        type:Schema.Types.ObjectId,
        ref:'Recipe'
      }
    ],
    circles:[
      {
        type:Schema.Types.ObjectId,
        ref:'Circle'
      },
    ]
  },
  { timestamps: true },
  { minimize: false }
);



module.exports = mongoose.model("User", userSchema);
