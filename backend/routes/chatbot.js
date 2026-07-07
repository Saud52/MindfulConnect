const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// @route   GET api/chatbot/history
// @desc    Get user's chat history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const history = await ChatHistory.findOne({ user: req.user.id });
    if (!history) {
      return res.json({ messages: [] });
    }
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chatbot
// @desc    Get AI response from Gemini and save history
// @access  Private
router.post('/', auth, async (req, res) => {
  const { messages, zone } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ msg: 'Please provide a message history array.' });
  }

  try {
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ msg: 'Gemini API key is not configured. Please add it to the .env file.' });
    }

    // Adapt system prompt based on zone
    let zoneContext = '';
    if (zone === 'Red') {
      zoneContext = "scored in the 'Red Zone' (High levels of stress, anxiety, or depression). Be extra cautious, highly supportive, and strongly encourage professional help.";
    } else if (zone === 'Yellow') {
      zoneContext = "scored in the 'Yellow Zone' (Moderate levels of stress, anxiety, or depression). Provide balanced support and practical self-care tips.";
    } else {
      zoneContext = "scored in the 'Green Zone' (Normal/Healthy range). Congratulate them on their well-being and offer tips to maintain their mental health.";
    }

    const systemPrompt = `You are a supportive, empathetic, and professional mental health assistant for students in India. 
    The student has ${zoneContext}
    Your goal is to:
    1. Listen actively and provide warm, empathetic support. Always acknowledge their feelings first.
    2. Offer concise, practical advice. Use BULLET POINTS for self-care tips or suggestions to make them easy to read.
    3. Ask one meaningful open-ended question to understand them better.
    4. Provide comforting advice that makes them feel validated.
    5. Encourage professional help if appropriate for their zone.
    
    CRITICAL - CRISIS HANDLING (INDIA):
    If the student expresses thoughts of self-harm, suicide, or severe crisis:
    - Urgently provide the following INDIAN helpline numbers ONLY:
      * Vandrevala Foundation (24x7): 9999 666 555
      * Kiran Helpline (Govt of India): 1800-599-0019
    - Direct them to the NIMHANS or AASRA website for immediate help.
    - DO NOT provide contact details for other countries.
    
    IMPORTANT: 
    - Keep your responses meaningful but CONCISE (no more than 150 words).
    - NEVER cut off mid-sentence. Always finish your last thought.
    - Use a warm, human-like tone, not overly formal.`;


    // Convert history to Gemini format
    let history = messages.slice(0, -1).map(msg => ({
      role: msg.type === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const firstUserIndex = history.findIndex(msg => msg.role === 'user');
    if (firstUserIndex !== -1) {
      history = history.slice(firstUserIndex);
    } else {
      history = [];
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    });



    const lastUserMessage = messages[messages.length - 1].text;
    const prompt = history.length === 0 ? `${systemPrompt}\n\nStudent: ${lastUserMessage}` : lastUserMessage;

    let result;
    let retries = 3;
    while (retries > 0) {
      try {
        result = await chat.sendMessage(prompt);
        break;
      } catch (err) {
        if (err.status === 503 && retries > 1) {
          console.log(`Gemini busy (503), retrying in 5s... (${retries - 1} left)`);
          retries--;
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else if (err.status === 429) {
          return res.status(429).json({ msg: 'Rate limit reached. Please wait a minute.' });
        } else {
          throw err;
        }
      }
    }

    const response = await result.response;
    const text = response.text();

    // Save history to database
    let userHistory = await ChatHistory.findOne({ user: req.user.id });
    const newMessages = [
      { text: lastUserMessage, type: 'user' },
      { text: text, type: 'bot' }
    ];

    if (userHistory) {
      userHistory.messages.push(...newMessages);
      userHistory.lastUpdated = Date.now();
      await userHistory.save();
    } else {
      // If it's the first time, include the initial greeting if it was there
      const finalMessages = messages.length > 1 ? [messages[0], ...newMessages] : newMessages;
      userHistory = new ChatHistory({
        user: req.user.id,
        messages: finalMessages
      });
      await userHistory.save();
    }

    res.json({ text });
  } catch (error) {
    console.error('Gemini API Error Detail:', error);
    res.status(500).json({ msg: 'Failed to get AI response.' });
  }
});

module.exports = router;

