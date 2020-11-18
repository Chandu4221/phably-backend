
const {
    friendByPhoneNumber,
    fetchAllFriends
} = require("../services/friend/friendService")

module.exports = {    
    searchByFriend:async(req,res) => {
        try {
            ReS(res,await friendByPhoneNumber(req),200)
          } catch (error) {
              console.log(error)
            ReE(res, error, 422, "friend Controller >>> create friend method");
          }
    },
    getAllFriends:async(req,res) => {
        try {
            ReS(res,await fetchAllFriends(req),200)
        } catch (error) {
              console.log(error)
            ReE(res, error, 422, "friend Controller >>> create friend method");
        }
    }
}