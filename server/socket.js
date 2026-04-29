module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // JOIN ROOMS
    socket.on('join:admin', () => {
      socket.join('admin');
      console.log('User joined admin room');
    });

    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User joined room: user:${userId}`);
    });

    socket.on('join:rider', (riderId) => {
      socket.join(`rider:${riderId}`);
      console.log(`Rider joined room: rider:${riderId}`);
    });

    socket.on('join:order_room', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`User joined order room: order:${orderId}`);
    });

    socket.on('join:chat', (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`User joined chat room: chat:${chatId}`);
    });

    // RIDER EVENTS
    socket.on('rider:update_location', (data) => {
      const { lat, lng, riderId, orderId } = data;
      // Emit to admin
      io.to('admin').emit('rider:location', { riderId, lat, lng });
      // Emit to order room (for customer tracking)
      if (orderId) {
        io.to(`order:${orderId}`).emit('rider:location', { lat, lng });
      }
    });

    // CHAT EVENTS
    socket.on('chat:typing', (data) => {
      const { chatId, isTyping } = data;
      socket.to(`chat:${chatId}`).emit('chat:typing', { chatId, isTyping });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
