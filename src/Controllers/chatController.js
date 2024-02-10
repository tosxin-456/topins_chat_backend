// Import necessary modules
const socketIo = require('socket.io');
const chatModel = require('./models/chat'); // Assuming you have a model for chat messages

// Initialize Socket.IO server
const initSocketIo = (server) => {
  const io = socketIo(server);

  // Handle incoming socket connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle message sending
    socket.on('send-message', async (messageData) => {
      try {
        // Save message to the database
        const newMessage = await chatModel.create(messageData);

        // Broadcast the message to all connected clients
        io.emit('receive-message', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initSocketIo;
