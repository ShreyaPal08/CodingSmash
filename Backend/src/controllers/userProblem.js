
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User=require("../models/user");
const Submission=require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")
const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution
  } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !difficulty || !tags) {
      return res.status(400).send("Missing required fields");
    }

    if (!visibleTestCases || visibleTestCases.length === 0) {
      return res.status(400).send("No visible test cases provided");
    }

    // Loop through reference solutions for each language
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).send(`Invalid language: ${language}`);
      }

      const submissions = visibleTestCases.map(testcase => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      // Check for missing code/output in submissions
      for (const sub of submissions) {
        if (!sub.source_code || !sub.expected_output) {
          return res.status(400).send("Missing code or expected output");
        }
      }

      // Submit batch to Judge0
      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map(value => value.token);

      // Poll Judge0 for results
      const testResults = await submitToken(resultTokens);
       

      console.log(testResults);
      // Verify all tests passed
      for (const test of testResults) {
        if (test.status_id !== 3) {
          return res.status(400).send("Error occurred while validating solution");
        }
      }
    }

    // Save the problem in DB
    await Problem.create({
      ...req.body,
      problemCreator: req.result._id
    });

    // Send plain text response instead of JSON
    res.status(201).send("Problem created/saved successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};


const updateProblem= async (req,res)=>{
  const {id} =req.params;
    const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution
  } = req.body;


  try{

    if(!id){
     return  res.status(400).send("Invalid Id Field")
    }

    const DSAProblem=await Problem.findById(id);

    if(!DSAProblem){
      return res.status(404).send("ID is not present in server");
    }



      if (!title || !description || !difficulty || !tags) {
      return res.status(400).send("Missing required fields");
    }

    if (!visibleTestCases || visibleTestCases.length === 0) {
      return res.status(400).send("No visible test cases provided");
    }

    // Loop through reference solutions for each language
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).send(`Invalid language: ${language}`);
      }

      const submissions = visibleTestCases.map(testcase => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      // Check for missing code/output in submissions
      for (const sub of submissions) {
        if (!sub.source_code || !sub.expected_output) {
          return res.status(400).send("Missing code or expected output");
        }
      }

      // Submit batch to Judge0
      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map(value => value.token);

      // Poll Judge0 for results
      const testResults = await submitToken(resultTokens);

      // Verify all tests passed
      for (const test of testResults) {
        if (test.status_id !== 3) {
          return res.status(400).send("Error occurred while validating solution");
        }
      }
    }

   const  newProblem= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});

   res.status(200).send(newProblem);
  }

  catch(err){
           res.status(500).send("Error "+err);
  }
}

const deleteProblem=async (req,res)=>{
  const {id} =req.params;
  try{
    if(!id)
      return res.status(400).send("ID is Missing");

    const deleteProblem=await Problem.findByIdAndDelete(id);

    if(!deleteProblem)
      return res.status(404).send("Problem is Missing");


    res.status(200).send("Successfully Deleted");
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}

const getProblemById=async (req,res)=>{
  const {id} =req.params;
  try{
    if(!id)
      return res.status(400).send("ID is Missing");

     const getProblem =await Problem.findById(id).select('_id  title description  difficulty tags visibleTestCases  startCode referenceSolution ');
      
     //  select me agr -hiddenTestCases aise karke ke (-ye lga ke) likhenge to hiddenTestCases ko chhod ke baki print ho jayega

    if(!getProblem)
      return res.status(404).send("Problem is Missing");

    const videos = await SolutionVideo.findOne({problemId:id});
    if(videos){   
      
      const responseData={
        ...getProblem.toObject(),
           secureUrl : videos.secureUrl,
  //  getProblem.cloudinaryPublicId = cloudinaryPublicId;
   thumbnailUrl : videos.thumbnailUrl,
   duration : videos.duration,
      }


   return res.status(200).send(responseData);
   }

    res.status(200).send(getProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}

const getAllProblem=async (req,res)=>{
  try{
    
    const getProblem=await Problem.find({}).select('_id  title description  difficulty tags ');
    if(getProblem.length==0)
      return res.status(404).send("Problem is Missing");

    res.status(200).send(getProblem);
  }

  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const solvedAllProblembyUser=async(req,res)=>{
  try{
    // const count=req.result.problemSolved.length;
    // res.status(200).send(count);
    const userId=req.result._id;

    const user=await User.findById(userId).populate({
      path:"problemSolved",
      select:"_id title difficulty tags"
    });

    res.status(200).send(user.problemSolved);
  }
  catch(err){
    res.status(500).send("Server Error");

  }
}

const submittedProblem=async(req,res)=>{
  try{
     const userId=req.result._id;
     const problemId=req.params.pid;

     const ans=await Submission.find({userId,problemId});

     if(ans.length==0)
      res.status(200).send("No Submission is present");

     res.status(200).send(ans);
  }
  catch(err){
       res.status(500).send("Internal Server Error");
  }
}

module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};







