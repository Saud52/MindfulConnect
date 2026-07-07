const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Note: The SDK doesn't have a direct listModels method on genAI,
    // but we can use the fetch API if we want to be sure.
    // However, let's try 'gemini-1.0-pro'
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent("test");
    console.log("gemini-1.0-pro WORKS");
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
