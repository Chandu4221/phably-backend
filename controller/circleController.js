const { update } = require("../models/user");
const {
    createCircle,
    fetchCircles,
    updateCircle,
    deleteCircle
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
    updateCircle: async(req, res) => {
      try {
        ReS(res,await updateCircle(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "circle Controller >>> updateCircle method");
      }
    },
    deleteCircle:async (req, res) => {
      try {
        ReS(res,await deleteCircle(req),200)
      } catch (error) {
          console.log(error)
        ReE(res, error, 422, "circle Controller >>> deleteCircle method");
      }
    }
}