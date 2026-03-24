const axios = require("axios");

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        inputs: question
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("AI RAW:", response.data);

    const answer =
      response.data?.[0]?.generated_text ||
      response.data?.generated_text ||
      "No response from AI";

    res.json({ answer });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI service error",
      error: error.response?.data || error.message
    });
  }
};






// const axios = require("axios");

// exports.askAI = async (req, res) => {
//   try {
//     const { question } = req.body;

//     const response = await axios.post(
//       "https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
//       {
//         inputs: question
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log("AI RAW:", response.data);

//     const answer =
//       response.data?.[0]?.generated_text ||
//       "No response from AI";

//     res.json({ answer });

//   } catch (error) {
//     console.error("AI ERROR:", error.response?.data || error.message);

//     res.status(500).json({
//       message: "AI service error",
//       error: error.response?.data || error.message
//     });
//   }
// };





// // const axios = require("axios");

// // exports.askAI = async (req, res) => {
// //   try {
// //     const { question } = req.body;

// //     // ❌ Validate input
// //     if (!question) {
// //       return res.status(400).json({ message: "Question is required" });
// //     }

// //     const response = await axios.post(
// //       "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
// //       {
// //         inputs: question
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${process.env.HF_API_KEY}`,
// //           "Content-Type": "application/json"
// //         },
// //         timeout: 10000 // ⏱️ 10 sec timeout (important)
// //       }
// //     );

// //     // ✅ Safe response extraction
// //     let answer = "AI is thinking 🤖";

// //     if (Array.isArray(response.data)) {
// //       answer = response.data[0]?.generated_text || answer;
// //     } else if (response.data?.generated_text) {
// //       answer = response.data.generated_text;
// //     }

// //     res.json({ answer });

// //   } catch (error) {
// //     console.error("AI ERROR:", error.response?.data || error.message);

// //     // ✅ Smart fallback response
// //     res.json({
// //       answer: "⚠️ AI is currently unavailable. Try again later."
// //     });
// //   }
// // };




// // const axios = require("axios");

// // exports.askAI = async (req, res) => {
// //   try {

// //     const { question } = req.body;

// //     const response = await axios.post(
// //     //   "https://api-inference.huggingface.co/models/google/flan-t5-base",
// //     "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
// //       { inputs: question },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${process.env.HF_API_KEY}`
// //         }
// //       }
// //     );

// //     const answer = response.data[0]?.generated_text || "No response";

// //     res.json({ answer });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "AI error" });
// //   }
// // };