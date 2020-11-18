const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken")
const {
    createNewCircle,
    fetchAllCircle
} = require("../controller/circleController")

router.get("",checkToken,fetchAllCircle)
router.post("",checkToken,createNewCircle)



module.exports = router;