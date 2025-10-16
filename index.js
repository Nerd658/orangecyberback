require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');
const app = express();
const port = process.env.PORT || 3000;

const userService = require('./src/services/userService');
const quizService = require('./src/services/quizService');

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = require('./src/socket').init(server);

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', apiRoutes);

io.on('connection', async (socket) => {
  console.log('Client connected');

  // Send initial state to the client
  try {
    const userCount = await userService.getUserCount();
    socket.emit('participant_count_init', userCount);

    const leaderboard = await quizService.getLeaderboard();
    socket.emit('leaderboard_init', leaderboard);
  } catch (error) {
    console.error('Error sending initial state:', error);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
