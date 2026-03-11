const Tesseract = require("tesseract.js");

exports.extractReceiptData = async (imagePath) => {

  try {

    const result = await Tesseract.recognize(imagePath, "eng");

    const text = result.data.text;

    console.log("OCR TEXT:", text);

    // -------------------------------
    // Detect TOTAL amount
    // -------------------------------
    const amountMatch = text.match(/total\s*\$?\s*([\d,.]+)/i);

    const amount = amountMatch ? amountMatch[1] : null;

    // -------------------------------
    // Detect date
    // -------------------------------
    const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

    const date = dateMatch ? dateMatch[0] : null;

    // -------------------------------
    // Detect merchant
    // -------------------------------
    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");

    let merchant = lines.length > 0 ? lines[0] : null;

    // Clean merchant name
    if (merchant) {
      merchant = merchant
        .replace(/[0-9]/g, "")   // remove numbers
        .replace(/[,]/g, "")     // remove commas
        .trim();
    }

    // -------------------------------
    // Return extracted data
    // -------------------------------
    return {
      merchant,
      amount,
      date,
      text   // full OCR text for AI classification
    };

  } catch (error) {

    console.error("OCR ERROR:", error);
    throw error;

  }

};





// const Tesseract = require("tesseract.js");

// exports.extractReceiptData = async (imagePath) => {
//   try {

//     const result = await Tesseract.recognize(imagePath, "eng");

//     const text = result.data.text;

//     console.log("OCR TEXT:", text);

//     // detect amount (TOTAL)
//     // const amountMatch = text.match(/total[^0-9]*([\d.,]+)/i);

//     // const amount = amountMatch ? amountMatch[1] : null;
//     // detect TOTAL amount
//     // detect TOTAL amount
//     const amountMatch = text.match(/total\s*\$?\s*([\d,.]+)/i);

//     const amount = amountMatch ? amountMatch[1] : null;

//     // detect date
//     const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

//     const date = dateMatch ? dateMatch[0] : null;

//     // detect merchant
//     const lines = text.split("\n").filter(l => l.trim() !== "");

//     const merchant = lines.length > 0 ? lines[0] : null;

//     return {
//       merchant,
//       amount,
//       date,
//       // rawText: text
//       text: extractedText
//     };

//   } catch (error) {

//     console.error("OCR ERROR:", error);
//     throw error;

//   }
// };





// const Tesseract = require("tesseract.js");

// exports.extractReceiptData = async (imagePath) => {
//   try {

//     const result = await Tesseract.recognize(
//       imagePath,
//       "eng"
//     );

//     const text = result.data.text;

//     console.log("OCR TEXT:", text);

//     // simple amount detection
//     const amountMatch = text.match(/(\d+[.,]?\d*)/);

//     const amount = amountMatch ? amountMatch[0] : null;

//     return {
//       text,
//       amount
//     };

//   } catch (error) {
//     console.error("OCR ERROR:", error);
//     throw error;
//   }
// };