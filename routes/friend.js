const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken")
const {
    searchByFriend,
    getAllFriends
} = require("../controller/friendController")

router.post('/search-by-phoneNumber',checkToken,searchByFriend)
router.get('',checkToken,getAllFriends)



module.exports = router;