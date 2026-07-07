const axios = require('axios');

async function testChatbot() {
  try {
    const res = await axios.post('http://localhost:5000/api/chatbot', {
      messages: [{ text: "Hello", type: "user" }]
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': 'MOCK_TOKEN' // This will fail auth but should pass JSON parsing
      }
    });
    console.log('Response:', res.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testChatbot();
