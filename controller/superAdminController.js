const {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    loginSuperAdmin,
    getAllAdmin,
    updateSuperAdmin,
    logoutAdmin
  } = require("../services/superadmin/superAdminService")
  
  module.exports = {    
  
  
    /*
      This handler is use for the create admin user.
    */
    createAdmin:async(req,res) => {
        try {
            ReS(res,await createAdmin(req),200)
        } catch (error) {
          ReE(res, error, 422, "superAdminController Controller >>> create createAdmin method");
        }
      },
  
    /*
      This handler is use for the update admin user.
    */
   updateAdmin:async(req,res) => {
      try {
          ReS(res,await updateAdmin(req),200)
      } catch (error) {
        ReE(res, error, 422, "superAdminController Controller >>> create updateAdmin method");
      }
    },
  
      /*
        This handler is use for the delete admin user.
      */
      deleteAdmin:async(req,res) => {
        try {
            ReS(res,await deleteAdmin(req),200)
        } catch (error) {
          ReE(res, error, 422, "superAdminController Controller >>> create deleteAdmin method");
        }
      },
      /*
        This handler is use login of user
      */
     loginAdmin:async(req,res) => {
      try {
           ReS(res,await loginSuperAdmin(req),200)
        } catch (error) {
         ReE(res, error, 422, "superAdminController Controller >>> create loginAdmin method");
        }
     },
     /*
        This handler is use get all admin in system
      */
     getAllAdmin:async(req,res) => {
      try {
           ReS(res,await getAllAdmin(req),200)
        } catch (error) {
         ReE(res, error, 422, "superAdminController Controller >>> create getAllAdmin method");
        }
     },

    /*
      This handler is use get all admin in system
    */
     updateSuperAdmin:async(req,res) => {
      try {
           ReS(res,await updateSuperAdmin(req),200)
        } catch (error) {
         ReE(res, error, 422, "superAdminController Controller >>> create updateSuperAdmin method");
        }
     },
      /*
        This handler is use logout the superadmin
      */
     logoutAdmin:async(req,res) => {
      try {
          ReS(res,await logoutSuperAdmin(req),200)
        } catch (error) {
        ReE(res, error, 422, "superAdminController Controller >>> create logoutAdmin method");
        }
    }


    //  logoutAdmin
  }