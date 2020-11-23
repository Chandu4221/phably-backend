const express = require("express");
const router = express.Router();
const superAdminToken = require("../middleware/superAdminToken")
const superAdminController = require("../controller/superAdminController")

router.get("",superAdminToken,superAdminController.getAllAdmin)
router.post("",superAdminToken,superAdminController.createAdmin)
router.put("",superAdminToken,superAdminController.updateAdmin)
router.delete("/:adminId",superAdminToken,superAdminController.deleteAdmin)


router.post("/login",superAdminController.loginAdmin)
router.post("/logout",superAdminToken,superAdminController.logoutAdmin)
router.put("/update",superAdminToken,superAdminController.updateSuperAdmin)


module.exports = router
