const {
    createUser,
    profileUpdate
  } = require("../services/user/userService");

const User = require("../models/user")
const {
  loginSendOtp
} = require("../services/utils/otpService");


module.exports = {
    /**
     * ----------|| User Create ||------------
     */
    create: async (req, res) => {
      try {
        ReS(res, await createUser(req), 200);
      } catch (error) {
        ReE(res, error, 422, "User Controller >>> create method");
      }
    },

    login: async (req, res) => {
      try{
        ReS(res, await loginUser(req.body), 200);
      }catch(error){
        ReE(res, error, 400, "User Controller >>> loginUser");
      }
    },
    sendOtp: async(req,res) => {
      try{
        ReS(res, await loginSendOtp(req), 200);
      }catch(error){
        ReE(res, error, 400, "User Controller >>> send otp");
      }
    },
    userProfileUpdate:async (req, res) => {
      try{
        ReS(res, await profileUpdate(req), 200);
      }catch(error){
        ReE(res, error, 400, "User Controller >>> Profile Update");
      }
    },
    userDetails: async (req, res) => {
      const {decoded} = req
      const userId = decoded._id
      const user = await User.findById(userId)

      return ReS(res,{data:{user}},200)
    },
    otherUserDetails: async (req, res) => {
      const {userId} = req.params
      const user = await User.findById(userId)
      return ReS(res,{data:{user}},200)
    }
    
  };
  