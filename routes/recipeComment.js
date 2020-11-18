const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken")
const {addComment,getComments,updateComments,deleteComments} = require("../controller/receipeCommentController")

router.post("/:recipeId",checkToken,addComment)
router.get("/:recipeId",checkToken,getComments)
router.put("",checkToken,updateComments)
router.delete("/:commentId",checkToken,deleteComments)






module.exports = router;