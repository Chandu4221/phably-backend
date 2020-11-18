const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const circleSchema = new Schema(
  {
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:[true,"Admin Id is required"]
    },
    circleName: {
      type: String,
      require:[true,"Circle Name is required"]
    },
    circleImage:{
      type: String,
      default:null
    },
    circleDescription:{
      type:String,
      default:""
    },
    circleMembersId:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ]
  },
  { timestamps: true },
  { minimize: false }
);


circleSchema.method.isAdmin = (userId) => {
  return userId.toString() === this.adminId.toString()
}

module.exports = mongoose.model("Circle", circleSchema)