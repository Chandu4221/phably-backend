const express = require("express");
const router = express.Router();
const { createNewProcedure,updateProcedure,deleteProcedure,getAllProcedures } = require("../controller/receipeController");
const checkToken = require("../middleware/checkToken")

router.get("/:recipeId",checkToken,getAllProcedures)
router.post("",checkToken,createNewProcedure)
router.put("",checkToken,updateProcedure)
router.delete("/:recipeId/:stepId",checkToken,deleteProcedure)



module.exports = router;