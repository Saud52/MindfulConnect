const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testGemini() {
  console.log('Using API Key:', process.env.GEMINI_API_KEY ? 'Present (Starts with ' + process.env.GEMINI_API_KEY.substring(0, 5) + '...)' : 'Missing');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('No API Key found in .env');
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = "Say 'Hello, I am working!' if you can hear me.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini Response:', text);
  } catch (error) {
    console.error('Gemini Test Error:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

testGemini();
