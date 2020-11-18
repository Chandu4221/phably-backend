const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
{
    message: {
        type: String,
        default: ""
    },
    messageType:{
        type:String,
        enum: ["message","recipe"],
        require:[true,"Message Type is require"]
    },
    recipeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    circleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle'
    },
  },
  { timestamps: true },
  { minimize: false }
);



module.exports = mongoose.model("Message", messageSchema)