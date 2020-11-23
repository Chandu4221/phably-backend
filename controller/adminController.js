const {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  loginAdmin
} = require("../services/admin/adminService")

module.exports = {    


  /*
    This handler is use for the create admin user.
  */
  createAdmin:async(req,res) => {
      try {
          ReS(res,await createAdmin(req),200)
      } catch (error) {
        ReE(res, error, 422, "adminController Controller >>> create createAdmin method");
      }
    },

  /*
    This handler is use for the update admin user.
  */
 updateAdmin:async(req,res) => {
    try {
        ReS(res,await updateAdmin(req),200)
    } catch (error) {
      ReE(res, error, 422, "adminController Controller >>> create updateAdmin method");
    }
  },

    /*
      This handler is use for the delete admin user.
    */
    deleteAdmin:async(req,res) => {
      try {
          ReS(res,await deleteAdmin(req),200)
      } catch (error) {
        ReE(res, error, 422, "adminController Controller >>> create deleteAdmin method");
      }
    },
    /*
      This handler is use login of user
    */
   loginAdmin:async(req,res) => {
    try {
         ReS(res,await loginAdmin(req),200)
      } catch (error) {
       ReE(res, error, 422, "adminController Controller >>> create loginAdmin method");
      }
    }
}