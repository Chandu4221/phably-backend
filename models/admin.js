const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    adminName:{
        type: String,
        require:[true,"Admin Name is Required"]
    },
    adminEmail:{
        type: String,
        require:[true,"Admin Email is Required"],
        unique: true
    },
    hash:{
        type: String,
        require:[true,"Admin Hash is Required"]
    },
    loginToken:{
      type: String,
      default:""
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true },
  { minimize: false }
);


module.exports = mongoose.model("Admin", adminSchema)