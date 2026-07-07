const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const ChatHistory = require('./models/ChatHistory');

async function checkHistory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const histories = await ChatHistory.find().populate('user', 'name');
    console.log(`Found ${histories.length} chat histories:`);
    
    histories.forEach(h => {
      console.log(`User: ${h.user?.name || 'Unknown'} (${h.user?._id})`);
      console.log(`Messages: ${h.messages.length}`);
      if (h.messages.length > 0) {
        console.log(`Last message: ${h.messages[h.messages.length-1].text.substring(0, 30)}...`);
      }
      console.log('---');
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkHistory();
