const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Try v1 instead of v1beta
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

  try {
    const result = await model.generateContent("test");
    const response = await result.response;
    console.log('Response:', response.text());
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGemini();
