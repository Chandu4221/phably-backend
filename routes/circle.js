const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken")
const {
    createNewCircle,
    fetchAllCircle,
    updateCircle,
    deleteCircle
} = require("../controller/circleController")

router.get("",checkToken,fetchAllCircle)
router.post("",checkToken,createNewCircle)
router.put("",checkToken,updateCircle)
router.delete("/:circleId",checkToken,deleteCircle)





module.exports = router;