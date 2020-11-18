const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken")
const {
    sendGroupMessage,
    getGroupMessage,
    sendPrivateMessage,
    getPrivateMessage
} = require("../controller/chatController")

router.get('/one-one/:receiverId/:page',checkToken,getPrivateMessage)
router.post('/one-one',checkToken,sendPrivateMessage)
router.post('/group',checkToken,sendGroupMessage)
router.get('/group/:circleId/:page',checkToken,getGroupMessage)

module.exports = router;