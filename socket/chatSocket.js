const { default: mongoose } = require("mongoose");
const {
  createChat,
  getChatByFilter,
  updateChatById,
} = require("../services/chatServices");
const { logger } = require("../utils/winstonLogger");
const { getCurrentTime } = require("../utils/currentTime");
const { AppError } = require("../utils/AppError");

exports.chatSocket = async (io, socket) => {
  // JOIN CHAT EVENT
  socket.on("setup", async (payload) => {
    try {
      const chat = await getChatByFilter(
        {
          $and: [
            {
              $or: [
                { firstUserId: payload.senderId },
                { secondUserId: payload.senderId },
              ],
            },
            {
              $or: [
                { firstUserId: payload.receiverId },
                { secondUserId: payload.receiverId },
              ],
            },
          ],
        },
        "_id firstUserId secondUserId chat",
        { lean: true }
      );

      if (chat) {
        socket.join(chat._id.toString());
        socket.emit("chat-history", chat);
        logger.info(`Socket ${socket.id} joined room ${chat._id.toString()}`);
      } else {
        const newChat = await createChat({
          firstUserId: payload.senderId,
          secondUserId: payload.receiverId,
          chat: [
            {
              receiverId: payload.receiverId,
              senderId: payload.senderId,
              message: "Chat started",
              time: "",
              isDeleted: true,
            },
          ],
        });
        if (!newChat) {
          throw new AppError(400, "Failed to create new chat");
        }
        socket.join(newChat._id.toString());
        socket.emit("chat-history", newChat);
        logger.info(
          `Socket ${socket.id} joined new room ${newChat._id.toString()}`
        );
      }
    } catch (error) {
      socket.emit("error", "Error during chat setup");
    }
  });

  // UPDATE CHAT EVENT
  socket.on("new-message", async (data) => {
    try {
      const chatId = new mongoose.Types.ObjectId(data._id);
      const update_chat = await updateChatById(
        chatId,
        {
          $push: {
            chat: {
              ...data.msg,
              time: getCurrentTime(),
            },
          },
        },
        { new: true }
      );
      if (update_chat) {
        io.to(chatId.toString()).emit("chat-history", update_chat);
      } else {
        socket.emit("error", "Error to add new message");
      }
    } catch (error) {
      socket.emit("error", "Error processing new message");
    }
  });
};
