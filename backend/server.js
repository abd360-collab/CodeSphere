const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');
const runRoutes = require('./routes/run.js');
const { setupSocketHandlers } = require('./socket/socketHandlers');

const app = express();
const server = http.createServer(app);

// Logging
app.use(morgan('dev')); // 'dev' is cleaner for development

// ✅ FIXED: Proper CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true, // ⭐ Critical for auth tokens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// ✅ FIXED: Rate limiting (more lenient for development)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, // Increased from 10 to 100
  message: "Too many requests, please try again later."
});

// Only apply in production
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', apiLimiter);
}

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/run', runRoutes);
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Socket.IO handlers
setupSocketHandlers(io);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative-code-editor')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});