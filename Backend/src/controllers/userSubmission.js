// const { request } = require("express");
// const Problem=require("../models/problem");
// const Submission=require("../models/submission");
// const {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility");

// const submitCode=async (req,res)=>{
//   try{
//     const userId=req.result._id;
//     const problemId=req.params.id;

//     const {code,language}=req.body;

//     if(!userId||!code||!problemId||!language)
//         return res.this.status(400).send("Some field missing");
//     //fetch the problem from database
//     //testcases(Hidden)
//     const problem=await Problem.findById(problemId);

//     //kya apne submission store kar du pehle...

//     const submittedResult=await Submission.create({
//         userId,
//         problemId,
//         code,
//         language,
//         // testCasesPassed:0,
//         status:'pending',
//         testCasesTotal:problem.hiddenTestCases.length
//     })

//     const languageId= getLanguageById(language);

//     const submissions=problem.hiddenTestCases.map((testcase)=>({
//         source_code:code,
//         language_id:languageId,
//         stdin: testcase.input,
//         expected_output:testcase.output
//     }));

//     const submitResult=await submitBatch(submissions);
//     const resultToken=submitResult.map((value)=>value.token);

//     const testResults=await submitToken(resultToken);

//     //submittedResult ko update karo

//     let testCasesPassed=0;
//     let runtime=0;
//     let memory=0;
//     let status='accepted';
//     let errorMessage=null;

//     for(const test of testResults){
//         if(test.status_id==3){
//             testCasesPassed++;
//             runtime=runtime+parseFloat(test.time)
//             memory=Math.max(memory,test.memory);
//         }
//         else{
//             if(test.status_id==4){
//                 status='error'
//                 errorMessage=test.stderr
//             }
//             else{
//                 status='wrong'
//                 errorMessage=test.stderr
//             }
//         }
//     }

//     submittedResult.status=status;
//     submittedResult.testCasesPassed=testCasesPassed;
//     submittedResult.errorMessage=errorMessage;
//     submittedResult.runtime=runtime;
//     submittedResult.memory=memory;

//     await submittedResult.save();

//     //ProblemId ko insert karenge userSchema ke problemSolved mein if it is not present there
//    //req.result==user Information
   
//     if(!req.result.problemSolved.includes(problemId)){
//         req.result.problemSolved.push(problemId);
//         await req.result.save();
//     }

//     res.status(201).send(submittedResult);


//   }
//   catch(err){
//       res.status(500).send("Internal Server Error "+err);
//   }
// }

// module.exports=submitCode;



//     language_id: 54,
//     stdin: '2   3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-08-25T20:06:40.840Z',
//     finished_at: '2025-08-25T20:06:41.427Z',
//     time: '0.003',
//     memory: 760,
//     stderr: null,
//     token: '07d3dcf2-d04c-4808-a82c-906cf02a7051',







// const Problem = require("../models/problem");
// const Submission = require("../models/submission");
// const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// const submitCode = async (req, res) => {
//   try {
//     const userId = req.result._id;
//     const problemId = req.params.id;
//     let { code, language } = req.body;



//     //  console.log("UserID:", userId);
//     // console.log("ProblemID:", problemId);
//     // console.log("Code:", code);
//     // console.log("Language:", language);

//     if (!userId || !code || !problemId || !language) {
//       return res.status(400).send("Some field is missing");
//     }


//   if(language==='cpp')
//         language='c++'
      
//       console.log(language);


//     // Fetch problem
//     const problem = await Problem.findById(problemId);
//     if (!problem) return res.status(404).send("Problem not found");

//     // Save initial submission
//     const submittedResult = await Submission.create({
//       userId,
//       problemId,
//       code,
//       language,
//       status: "pending",
//       testCasesTotal: problem.hiddenTestCases.length,
//     });

//     // Prepare judge0 submissions
//     const languageId = getLanguageById(language);
//     const submissions = problem.hiddenTestCases.map((testcase) => ({
//       source_code: code,
//       language_id: languageId,
//       stdin: testcase.input,
//       expected_output: testcase.output,
//     }));


// // const submissions = problem.hiddenTestCases.map((testcase) => ({
// //   source_code: Buffer.from(code).toString("base64"),
// //   language_id: languageId,
// //   stdin: Buffer.from(testcase.input).toString("base64"),
// //   expected_output: Buffer.from(testcase.output).toString("base64"),
// //   base64_encoded: true,
// // }));



//     const submitResult = await submitBatch(submissions);
//     const resultTokens = submitResult.map((value) => value.token);

//     // Get results
//     const testResults = await submitToken(resultTokens);

//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = "accepted";
//     let errorMessage = null;

//     for (const test of testResults) {
//       const statusId = test.status?.id; // ✅ fixed here
//       if (statusId === 3) {
//         testCasesPassed++;
//         runtime += parseFloat(test.time || 0);
//         memory = Math.max(memory, test.memory || 0);
//       } else {
//         if (statusId === 4) {
//           status = "error";
//           errorMessage = test.stderr || test.compile_output || "Runtime Error";
//         } else {
//           status = "wrong";
//           errorMessage = test.stderr || test.compile_output || "Wrong Answer";
//         }
//       }
//     }

//     // Update submission
//     submittedResult.status = status;
//     submittedResult.testCasesPassed = testCasesPassed;
//     submittedResult.errorMessage = errorMessage;
//     submittedResult.runtime = runtime;
//     submittedResult.memory = memory;

//     await submittedResult.save();

//     // Update user solved problems
//     if (!req.result.problemSolved.includes(problemId)) {
//       req.result.problemSolved.push(problemId);
//       await req.result.save();
//     }

//     return res.status(201).json(submittedResult);
//   } catch (err) {
//     console.error("Error in submitCode:", err.response?.data || err.message);
//     return res.status(500).send("Internal Server Error: " + err.message);
//   }
// };

// const runCode= async(req,res)=>{
//   try {
//     const userId = req.result._id;
//     const problemId = req.params.id;
//     let { code, language } = req.body;



//     //  console.log("UserID:", userId);
//     // console.log("ProblemID:", problemId);
//     // console.log("Code:", code);
//     // console.log("Language:", language);

//     if (!userId || !code || !problemId || !language) {
//       return res.status(400).send("Some field is missing");
//     }

//     // Fetch problem
//     const problem = await Problem.findById(problemId);
//     if (!problem) return res.status(404).send("Problem not found");

//      if(language==='cpp')
//         language='c++'
   

//     // Prepare judge0 submissions
//     const languageId = getLanguageById(language);
//     const submissions = problem.visibleTestCases.map((testcase) => ({
//       source_code: code,
//       language_id: languageId,
//       stdin: testcase.input,
//       expected_output: testcase.output,
//     }));


// //   const submissions = problem.visibleTestCases.map((testcase) => ({
// //   source_code: Buffer.from(code).toString("base64"),
// //   language_id: languageId,
// //   stdin: Buffer.from(testcase.input).toString("base64"),
// //   expected_output: Buffer.from(testcase.output).toString("base64"),
// //   base64_encoded: true,
// // }));


//     const submitResult = await submitBatch(submissions);
//     const resultTokens = submitResult.map((value) => value.token);

//     // Get results
//     const testResults = await submitToken(resultTokens);



//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = true;
//     let errorMessage = null;

//     for(const test of testResult){
//         if(test.status_id==3){
//            testCasesPassed++;
//            runtime = runtime+parseFloat(test.time)
//            memory = Math.max(memory,test.memory);
//         }else{
//           if(test.status_id==4){
//             status = false
//             errorMessage = test.stderr
//           }
//           else{
//             status = false
//             errorMessage = test.stderr
//           }
//         }
//     }




//     return res.status(201).json.json({
//     success:status,
//     testCases: testResults,
//     runtime,
//     memory
//    });
//   } catch (err) {
//     console.error("Error in submitCode:", err.response?.data || err.message);
//     return res.status(500).send("Internal Server Error: " + err.message);
//   }
// }

// module.exports = {submitCode,runCode};





// const Problem = require("../models/problem");
// const Submission = require("../models/submission");
// const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");







// const submitCode = async (req, res) => {
//   try {
//     const userId = req.result._id;
//     const problemId = req.params.id;
//     let { code, language } = req.body;

//     if (!userId || !code || !problemId || !language) {
//       return res.status(400).send("Some field is missing");
//     }

//     if (language === "cpp") language = "c++";

//     // Fetch problem
//     const problem = await Problem.findById(problemId);
//     if (!problem) return res.status(404).send("Problem not found");

//     // Save initial submission
//     const submittedResult = await Submission.create({
//       userId,
//       problemId,
//       code,
//       language,
//       status: "pending",
//       testCasesTotal: problem.hiddenTestCases.length,
//     });

//     // Prepare judge0 submissions
//     const languageId = getLanguageById(language);


//     const submissions = problem.hiddenTestCases.map((testcase) => ({
//       source_code: code,
//       language_id: languageId,
//       stdin: testcase.input,
//       expected_output: testcase.output,
//     }));

//     const submitResult = await submitBatch(submissions);

//     // const resultTokens = submitResult.map((value) => value.token);

// let resultTokens = [];
// if (Array.isArray(submitResult)) {
//   resultTokens = submitResult.map((v) => v.token);
// } else if (submitResult.tokens) {
//   resultTokens = submitResult.tokens;
// }
// // console.log("resultTokens:", resultTokens); 



//     // Get results
//     const testResults = await submitToken(resultTokens);

//     let testCasesPassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = "accepted";
//     let errorMessage = null;

//     for (const test of testResults) {
//       const statusId = test.status?.id;
//       if (statusId === 3) {
//         testCasesPassed++;
//         runtime += parseFloat(test.time || 0);
//         memory = Math.max(memory, test.memory || 0);
//       } else {
//         if (statusId === 4) {
//           status = "error";
//           errorMessage = test.stderr || test.compile_output || "Runtime Error";
//         } else {
//           status = "wrong";
//           errorMessage = test.stderr || test.compile_output || "Wrong Answer";
//         }
//       }
//     }

//     // Update submission
//     submittedResult.status = status;
//     submittedResult.testCasesPassed = testCasesPassed;
//     submittedResult.errorMessage = errorMessage;
//     submittedResult.runtime = runtime;
//     submittedResult.memory = memory;

//     await submittedResult.save();

//     // Update user solved problems
//     if (!req.result.problemSolved.includes(problemId)) {
//       req.result.problemSolved.push(problemId);
//       await req.result.save();
//     }

//     // ✅ Send clean response
//     return res.status(201).json({
//       status,
//       testCasesPassed,
//       testCasesTotal: problem.hiddenTestCases.length,
//       runtime,
//       memory,
//       errorMessage,
//     });
//   } catch (err) {
//     // console.error("Error in submitCode:", err.response?.data || err.message);

//     console.error("Error in submitCode:", err.response?.data || err.message, err.stack);

//     return res.status(500).send("Internal Server Error: " + err.message);
//   }
// };




const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some field is missing");
    }

    if (language === "cpp") language = "c++";

    // Fetch problem
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    // Save initial submission
    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    // Prepare judge0 submissions
    const languageId = getLanguageById(language);
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultTokens = submitResult.map((value) => value.token);

    // Get results
    const testResults = await submitToken(resultTokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResults) {
      const statusId = test.status?.id;
      if (statusId === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        if (statusId === 4) {
          status = "error";
          errorMessage = test.stderr || test.compile_output || "Runtime Error";
        } else {
          status = "wrong";
          errorMessage = test.stderr || test.compile_output || "Wrong Answer";
        }
      }
    }

    // Update submission
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    // Update user solved problems
    if (!req.result.problemSolved.includes(problemId)) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    return res.status(201).json(submittedResult);
  } catch (err) {
    console.error("Error in submitCode:", err.response?.data || err.message);
    return res.status(500).send("Internal Server Error: " + err.message);
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("Some field is missing");
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).send("Problem not found");

    if (language === "cpp") language = "c++";

    // Prepare judge0 submissions
    const languageId = getLanguageById(language);
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultTokens = submitResult.map((value) => value.token);

    // Get results
    const testResults = await submitToken(resultTokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    // ✅ FIX: testResults (not testResult)
    for (const test of testResults) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = false;
          errorMessage = test.stderr;
        } else {
          status = false;
          errorMessage = test.stderr;
        }
      }
    }

    return res.status(201).json({
      success: status,
      testCases: testResults,
      runtime,
      memory,
    });
  } catch (err) {
    console.error("Error in runCode:", err.response?.data || err.message);
    return res.status(500).send("Internal Server Error: " + err.message);
  }
};

module.exports = { submitCode, runCode };
