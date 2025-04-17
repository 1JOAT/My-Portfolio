const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schemas and Models
const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, default: () => uuidv4() },
  title: { type: String, required: true },
  status: { type: String, enum: ['Todo', 'Done'], default: 'Todo' },
  dueDate: { type: String, default: '' },
  userId: { type: String, required: true }
});

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, default: () => uuidv4() },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
  userId: { type: String, required: true }
});

const Task = mongoose.model('Task', taskSchema);
const Message = mongoose.model('Message', messageSchema);

// API Routes

// Task Routes
app.get('/tasks', async (req, res) => {
  try {
    const userId = req.query.userId || 'dev1';
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, dueDate, userId = 'dev1' } = req.body;
    const task = new Task({
      title,
      dueDate,
      userId
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ id });
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Message Routes
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const { text, userId = 'dev1' } = req.body;
    const message = new Message({
      text,
      timestamp: new Date().toISOString(),
      userId
    });
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  socket.on('message', async (messageData) => {
    try {
      const { text, userId = 'dev1' } = messageData;
      const message = new Message({
        text,
        timestamp: new Date().toISOString(),
        userId
      });
      const savedMessage = await message.save();
      io.emit('message', savedMessage); // Broadcast to all clients
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 