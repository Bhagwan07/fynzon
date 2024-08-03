const { updateUserById } = require("../services/userAuthServices");
const mongoose = require("mongoose");

const onlineUsers = new Map();

exports.onlineUsersSocket = async (io, socket) => {
  // add new User
  socket.on("add-new-user", async (userId) => {
    try {
      onlineUsers.set(socket.id, userId);
      io.emit("get-online-users", [...onlineUsers.values()]);
      const updatedLastSeen = await updateUserById(
        new mongoose.Types.ObjectId(userId),
        { date: new Date().getTime() },
        { new: true }
      );
      if (!updatedLastSeen) {
        socket.emit("error", "Failed to update last seen");
      }
    } catch (err) {
      socket.emit("error", "Failed to update last seen");
    }
  });

  // remove user
  socket.on("disconnect", async () => {
    try {
      onlineUsers.delete(socket.id);
      io.emit("get-online-users", [...onlineUsers.values()]);
      const updatedLastSeen = await updateUserById(
        new mongoose.Types.ObjectId(onlineUsers.get(socket.id || "")),
        { date: new Date().getTime() },
        { new: true }
      );
      if (!updatedLastSeen) {
        socket.emit("error", "Failed to update last seen");
      }
    } catch (err) {
      socket.emit("error", "Failed to update last seen");
    }
  });
};
