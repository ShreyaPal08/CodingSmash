
// const axios = require("axios");

// // Map language name to Judge0 language ID
// const getLanguageById = (lang) => {
//   const language = {
//     "c++": 54,
//     "java": 62,
//     "javascript": 63,
//   };
//   return language[lang.toLowerCase()];
// };

// // Submit multiple submissions to Judge0
// const submitBatch = async (submissions) => {
//   const options = {
//     method: "POST",
//     url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
//     params: {
//       base64_encoded: "false",
//     },
//     headers: {
//       "x-rapidapi-key": process.env.RAPIDAPI_KEY || "YOUR_API_KEY_HERE",
//       "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//       "Content-Type": "application/json",
//     },
//     data: {
//       submissions,
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     return response.data;
//   } catch (error) {
//     console.error("Error submitting batch:", error.message);
//     throw new Error("Judge0 batch submission failed");
//   }
// };

// // Promise-based waiting function
// const waiting = (timer) => {
//   return new Promise((resolve) => setTimeout(resolve, timer));
// };

// // Get results from Judge0 by tokens
// const submitToken = async (resultToken) => {
//   const options = {
//     method: "GET",
//     url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
//     params: {
//       tokens: resultToken.join(","),
//       base64_encoded: "false",
//       fields: "*",
//     },
//     headers: {
//       "x-rapidapi-key": process.env.RAPIDAPI_KEY || "YOUR_API_KEY_HERE",
//       "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//     },
//   };

//   async function fetchData() {
//     try {
//       const response = await axios.request(options);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching Judge0 results:", error.message);
//       throw new Error("Judge0 result fetch failed");
//     }
//   }

//   while (true) {
//     const result = await fetchData();

//     // Validate response format
//     if (!result || !Array.isArray(result.submissions)) {
//       throw new Error("Invalid Judge0 response format");
//     }

//     // Check if all submissions are finished
//     const isResultObtained = result.submissions.every(
//       (r) => r && r.status_id > 2
//     );

//     if (isResultObtained) {
//       return result.submissions.filter((r) => r !== null);
//     }

//     await waiting(1000); // Wait 1s before polling again
//   }
// };

// module.exports = { getLanguageById, submitBatch, submitToken };









const axios = require("axios");

// Map language name to Judge0 language ID
const getLanguageById = (lang) => {
  const language = {
    "c++": 54,        // C++ (GCC 9.2.0)
    "cpp": 54,        // optional alias
    "java": 62,       // Java (OpenJDK 13.0.1)
    "javascript": 63, // Node.js (12.14.0)
    "python": 71      // Python (3.8.1)
  };
  return language[lang.toLowerCase()];
};

// Submit multiple submissions to Judge0
const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "YOUR_API_KEY_HERE",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data; // Returns tokens
  } catch (error) {
    console.error("Error submitting batch:", error.response?.data || error.message);
    throw new Error("Judge0 batch submission failed");
  }
};

// Promise-based waiting function
const waiting = (timer) => {
  return new Promise((resolve) => setTimeout(resolve, timer));
};

// Get results from Judge0 by tokens
const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","), // multiple tokens comma separated
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "YOUR_API_KEY_HERE",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error("Error fetching Judge0 results:", error.response?.data || error.message);
      throw new Error("Judge0 result fetch failed");
    }
  }

  while (true) {
    const result = await fetchData();

    // Validate response format
    if (!result || !Array.isArray(result.submissions)) {
      throw new Error("Invalid Judge0 response format");
    }

 // Judge0 gives result.submissions[n].status.id (not status_id)
    const isResultObtained = result.submissions.every(
      (r) => r && r.status && r.status.id > 2
    );

    if (isResultObtained) {
      return result.submissions.filter((r) => r !== null);
    }

    await waiting(1000); // Wait 1s before polling again
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };







