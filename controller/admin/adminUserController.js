const {
    getUsers,
    updateBlockUser
  } = require("../../services/admin/adminService")
  
module.exports = {    
        /*
        This handler is use for the getting all users.
        */
        getUsers:async(req,res) => {
        try {
            ReS(res,await getUsers(req),200)
        } catch (error) {
          ReE(res, error, 422, "adminUserController Controller >>> get getUsers method");
        }
      },

      /*
        This handler is use for block and unblock user
        */
       updateBlockUser:async(req,res) => {
        try {
            ReS(res,await updateBlockUser(req),200)
        } catch (error) {
          ReE(res, error, 422, "adminUserController Controller >>> get updateBlockUser method");
        }
      },

      
}