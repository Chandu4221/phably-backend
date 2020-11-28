const User = require('../../models/user')
const jwt = require("jsonwebtoken");
const escapeStringRegexp = require('escape-string-regexp');


module.exports = (function () {
    /**
     * @params request, response
     * @For creating a new user
     */
    this.createUser = async ({ body }) => {
      try {
        const { name,loginText,loginType } = body.data;
        if(!name || !loginText || !loginType)
          throw new Error('Invalid Credentials',422)

        let email,phoneNumber;
        if(loginType === "mobile_number")
          phoneNumber = loginText
        else
          email = loginText

        /* validate */
        const isExisting = await User.findOne({ loginText });
        if (isExisting) {
          throw new Error('User already exists')
        }
        let newUser = new User({
          name,
          email,
          phoneNumber,
          loginText
        });
        
        await newUser.save();
        return {
          data: {
            user: {
              newUser,
            },
            message:"User Inserted !!"
          },
        };
      } catch (error) {
        TE(error);
      }
    };

    /**
     * @params request, response
     * @For login a user
     */
    this.loginUser = async ({loginText,verificationCode}) => {
      const user = await User.findOne({loginText})
      if(!user) 
        throw new Error('Cannot Found User')
     
     if(!user){
        throw new Error('Invalid User')
      }
      if(user.verificationCode != verificationCode){
        throw new Error('Invalid Verification Code')
      }

      await User.findOneAndUpdate(
        { loginText },
        { verificationCode: null }
      );

      const token = jwt.sign({ _id: user._id }, process.env.LOGIN_SECRETE, { expiresIn: '30 days' });
      const users = await User.findById(user._id);
      return {
        accessToken: token,
        message: "Login Successfull",
        user: users
      };
    
    }



    /**
     * @params request, response
     * @For updating the profile
     */
    this.profileUpdate = async({body,decoded,files}) => {
        //get all data for process
        const {name,email,phoneNumber,whichRecipe,fcmToken,gender} = body;
        const {profilePic} = files
        const userId = decoded._id
        if(!name)
        {
          throw new Error("Validation Error")
        }
        const user = await User.findById(userId)
        if(email){
          user.email = email
        }
        if(gender){
          user.gender = gender
        }
        if(name){
          user.name = name
        }
        
        if(phoneNumber){
          user.phoneNumber = phoneNumber
        }

        if(whichRecipe){
          user.whichRecipe = whichRecipe
        }

        if(fcmToken){
          user.fcmToken = fcmToken
        }

        if(profilePic){
          
          let profilePicLocation = await ImageUpload(profilePic)
          user.profilePic = profilePicLocation.Location
        }
        await user.save()
        return {data:user}
    }


    /**
     * @params query
     * @For suggestion of users
     */
    this.userSuggestion = async({query})=> {
      const {q} = query;
      if(!q){
        throw new Error('Invalid Parameter: query required');
      }
      const $regex = escapeStringRegexp(q);
      console.log($regex);
      const users = await User.find({ loginText: $regex});
      return users;
    }

    return this;
  })();