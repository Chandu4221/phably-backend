const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupMessageSchema = new Schema(
{
    message: {
        type: String,
        default: ""
    },
    senderId: {
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



module.exports = mongoose.model("GroupMessage", groupMessageSchema)