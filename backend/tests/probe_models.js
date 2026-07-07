const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the SDK for regular API keys sometimes, 
    // but let's try different model names.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("test");
            console.log(`Model ${m} is WORKING`);
            return;
        } catch (e) {
            console.log(`Model ${m} FAILED: ${e.message}`);
        }
    }
  } catch (error) {
    console.error('List Error:', error.message);
  }
}

listModels();
