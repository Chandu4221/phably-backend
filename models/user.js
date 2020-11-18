const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    profilePic:{
      type: String,
      default:""
    },
    loginText: {
      type: String,
      unique: [true, "Login Text is already exists."],
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
