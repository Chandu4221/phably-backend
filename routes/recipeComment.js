const express = require("express");
const router = express.Router();
const checkToken = require("../middleware/checkToken")
const {addComment,getComments,updateComments,deleteComments,addCommentLike} = require("../controller/receipeCommentController")

router.get("/:recipeId",checkToken,getComments)
router.post("",checkToken,addComment)
router.put("",checkToken,updateComments)
router.delete("/:commentId",checkToken,deleteComments)
router.post('/like',checkToken,addCommentLike)





module.exports = router;