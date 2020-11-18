let jwt = require("jsonwebtoken");

let checkToken = (req, res, next) => {
  try {
    let token = req.headers["authorization"]; // Express headers are auto converted to lowercase
    
    if (!token) {
      return ReE(res,{message: "You are not authorized to access this resource"},401)
    }

    let decoded = jwt.verify(token, process.env.LOGIN_SECRETE);
    req.decoded = decoded;
    next();
  } catch (err) {
    next(err);
  }
};


module.exports = checkToken 