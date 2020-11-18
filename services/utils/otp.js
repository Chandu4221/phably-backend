const User = require('../../models/user')



module.exports = (function () {
    /**
     * @params loginText
     * @For send Login Otp
     */
    this.loginSendOtp = async (loginText) => {
        const verificationCode = generateVerificationCode();

        if(!loginText){
            throw new Error("Cannot find loginText")
        }

        let isExist = User.findOne({loginText});
        if(isExist == "")
            throw new Error("Cannot Found email or phone")
        await User.updateOne({loginText},{verificationCode})
        if(validateEmail(loginText)){
            return {
                data:{
                    "message": "Otp sended"
                }
            }
        }else if(validatePhone(loginText)){
            return {
                data:{
                    "message": "Otp sended"
                }
            }
        }else{
            throw new Error("Cannot Found valid email or phone number")
        }
    }
    return this;
  })();