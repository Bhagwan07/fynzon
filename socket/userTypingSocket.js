const typingUserList = new Set();

exports.userTypingSocket = (io, socket) => {
  socket.on("typing", (payload) => {
    typingUserList.add(payload.userId);
    io.to(payload.chatId).emit("typing-list", [...typingUserList.values()]);
  });

  socket.on("stop-typing", (payload) => {
    typingUserList.delete(payload.userId);
    io.to(payload.chatId).emit("typing-list", [...typingUserList.values()]);
  });
};
