const {
    loginSendOtp
} = require("../services/utils/otpService")

module.exports = {
    sendLoginOtp: async (res,req) => {
        console.log(req.body)
        try{
            ReS(res, await loginSendOtp(req), 200);
        }catch(error){
            ReE(res, error, 400, "User Controller >>> Profile Update");
        }
    }
};
  