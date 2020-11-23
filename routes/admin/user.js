const express = require("express");
const router = express.Router();
const adminToken = require("../../middleware/adminToken")
const adminUserController = require("../../controller/admin/adminUserController")

router.get("",adminUserController.getUsers)
router.post('/block-unblock',adminUserController.updateBlockUser)

module.exports = router