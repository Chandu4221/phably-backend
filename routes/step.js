const express = require("express");
const router = express.Router();
const { createNewProcedure,updateProcedure,deleteProcedure } = require("../controller/receipeController");
const checkToken = require("../middleware/checkToken")

router.post("/:recipeId",checkToken,createNewProcedure)
router.put("/:recipeId",checkToken,updateProcedure)
router.delete("/:recipeId/:stepId",checkToken,deleteProcedure)



module.exports = router;