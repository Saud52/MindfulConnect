// backend/server.js

const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors'); // <-- IMPORTANT

// Load environment variables from backend/.env regardless of current working directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// --- FIXED CORS CONFIG ---
const allowedOrigins = [
  "http://localhost:3000",     // local React dev
  "http://localhost:5001",
  "http://10.0.1.21:3000",     // LAN frontend
  "http://10.0.1.21:5001"      // LAN frontend alternative
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Error handling for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON received:', err.message);
    return res.status(400).json({ msg: 'Invalid JSON payload' });
  }
  next();
});


// Test route
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// --- API ROUTES ---
const authRoutes = require('./routes/auth');
const dass21Routes = require('./routes/dass21');
const appointmentsRoutes = require('./routes/appointments');
const counsellorsRoutes = require('./routes/counsellors');
const studentsRoutes = require('./routes/students');
const usersRoutes = require('./routes/users');
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/auth', authRoutes);
app.use('/api/dass21', dass21Routes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/counsellors', counsellorsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chatbot', chatbotRoutes);

// --- SERVE REACT BUILD IN PRODUCTION ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*any', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

// Listen on ALL interfaces so LAN devices can connect
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);
