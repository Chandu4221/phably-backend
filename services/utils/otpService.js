const User = require('../../models/user')



module.exports = (function () {
    /**
     * @params loginText
     * @For send Login Otp
     */
    this.loginSendOtp = async ({body}) => {
        const {loginText,type} = body
        console.log(loginText,type)
        const verificationCode = generateVerificationCode();

        if(!loginText){
            throw new Error("Cannot find loginText")
        }

        let isExist = await User.findOne({loginText});
        console.log(isExist)
        if(isExist == null){
            //create new 
            const user = await User.create({loginText})
        }

        await User.updateOne({loginText},{verificationCode})
        if(type == "mobile"){
            return {
                data:{
                    "message": "Otp sended"
                }
            }
        }else if(type == "email"){
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