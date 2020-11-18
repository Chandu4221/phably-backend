const {
    createCircle,
    fetchCircles
} = require("../services/circle/circleService")
module.exports = {    
    createNewCircle:async(req,res) => {
        try {
            ReS(res,await createCircle(req),200)
          } catch (error) {
              console.log(error)
            ReE(res, error, 422, "circle Controller >>> create new circle method");
          }
    },
    fetchAllCircle:async(req,res) => {
        try {
            ReS(res,await fetchCircles(req),200)
          } catch (error) {
              console.log(error)
            ReE(res, error, 422, "circle Controller >>> fetch Circles method");
          }
    },
}