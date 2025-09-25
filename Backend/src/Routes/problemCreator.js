const express=require('express');

const problemRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware")
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}=require('../controllers/userProblem')
const userMiddleware=require('../middleware/userMiddleware')
//yha admin ka middlewaare  use hoga hoga 
 problemRouter.post("/create",adminMiddleware,createProblem);
 problemRouter.put("/update/:id",adminMiddleware,updateProblem);
 problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


// //yha user ka middleware
problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)

module.exports=problemRouter;