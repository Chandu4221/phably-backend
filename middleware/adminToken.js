let jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
let checkToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"]; // Express headers are auto converted to lowercase
    
    if (!token) {
      return ReE(res,{message: "You are not authorized to access this resource"},401)
    }
    let decoded = jwt.verify(token, process.env.LOGIN_ADMIN_SECRETE);

    let checkTokenInDatabase = await Admin.findById(decoded._id)
    if(checkTokenInDatabase.loginToken != token){
      return ReE(res,{message: "You are not authorized to access this resource"},401)
    }
    req.decoded = decoded;
    next();
  } catch (err) {
    next(err);
  }
};


module.exports = checkToken 