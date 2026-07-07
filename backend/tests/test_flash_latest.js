const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  try {
    const result = await model.generateContent("Say 'Flash Latest is working!'");
    const response = await result.response;
    console.log('Response:', response.text());
  } catch (error) {
    console.error('Error Status:', error.status);
    console.error('Error Message:', error.message);
  }
}

testGemini();
