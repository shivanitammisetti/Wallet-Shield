const axios = require("axios");

exports.classifyExpense = async (description) => {
  try {

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
      {
        inputs: description,
        parameters: {
          candidate_labels: [
            "Food",
            "Travel",
            "Shopping",
            "Bills",
            "Entertainment",
            "Health",
            "Education",
            "Other"
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = response.data;

    console.log("AI raw response:", data);

    // correct way for this response format
    if (Array.isArray(data) && data.length > 0) {
      return data[0].label;
    }

    return "Other";

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    return "Other";
  }
};



// const axios = require("axios");

// const fallbackClassifier = (text) => {
//   text = text.toLowerCase();

//   if (text.includes("pizza") || text.includes("burger") || text.includes("food") || text.includes("restaurant"))
//     return "Food";

//   if (text.includes("uber") || text.includes("taxi") || text.includes("bus") || text.includes("flight"))
//     return "Travel";

//   if (text.includes("amazon") || text.includes("shopping") || text.includes("clothes") || text.includes("laptop"))
//     return "Shopping";

//   if (text.includes("electricity") || text.includes("bill") || text.includes("water"))
//     return "Bills";

//   if (text.includes("movie") || text.includes("netflix") || text.includes("game"))
//     return "Entertainment";

//   if (text.includes("medicine") || text.includes("hospital"))
//     return "Health";

//   return "Other";
// };

// exports.classifyExpense = async (description) => {
//   try {

//     const response = await axios.post(
//       "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
//       {
//         inputs: description,
//         parameters: {
//           candidate_labels: [
//             "Food",
//             "Travel",
//             "Shopping",
//             "Bills",
//             "Entertainment",
//             "Health",
//             "Education",
//             "Other"
//           ]
//         }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json"
//         },
//         timeout: 8000
//       }
//     );

//     if (response.data && response.data.length > 0) {
//       return response.data[0].label;
//     }

//     return fallbackClassifier(description);

//   } catch (error) {
//     console.log("AI failed, using fallback...");
//     return fallbackClassifier(description);
//   }
// };



// const axios = require("axios");

// exports.classifyExpense = async (description) => {
//   try {

//     const response = await axios.post(
//       "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
//       {
//         inputs: description,
//         parameters: {
//           candidate_labels: [
//             "Food",
//             "Travel",
//             "Shopping",
//             "Bills",
//             "Entertainment",
//             "Health",
//             "Education",
//             "Other"
//           ]
//         }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const result = response.data;

//     return result[0].label;

//   } catch (error) {
//     console.error("AI ERROR:", error.response?.data || error.message);
//     throw new Error("AI classification failed");
//   }
// };





// const axios = require("axios");

// exports.classifyExpense = async (description) => {
//   try {

//     const response = await axios.post(
//       "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
//       {
//         inputs: description,
//         parameters: {
//           candidate_labels: [
//             "Food",
//             "Travel",
//             "Shopping",
//             "Bills",
//             "Entertainment",
//             "Health",
//             "Education",
//             "Other"
//           ]
//         }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const result = response.data;

//     if (!result || !result.labels) {
//       console.log("AI raw response:", result);
//       return "Other";
//     }

//     return result.labels;

//   } catch (error) {
//     console.error("AI ERROR:", error.response?.data || error.message);
//     throw new Error("AI classification failed");
//   }
// };