const app = require("./app");
const mongoose = require("mongoose");
const socketio = require("socket.io");
require("dotenv").config();

const { logger } = require("./utils/winstonLogger");
const { verifyUserToken } = require("./middlewares/socket/socketMiddlewares");
const { chatSocket } = require("./socket/chatSocket");
const { onlineUsersSocket } = require("./socket/onlineUserSocket");
const { userTypingSocket } = require("./socket/userTypingSocket");

process.on("uncaughtException", (err) => {
  console.log("=====UNCAUGHT EXCEPTION! 💥 Shutting down=====");
  console.log(err.name, err.message);
  process.exit(1);
});

// CONNECT MONGO_DB
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_URL)
  .then(() => {
    console.log("Connected Successfully to Port 27017...");
  })
  .catch((error) => {
    console.log(error);
  });

// START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// SOCKET IO SETUP
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_ENDPOINT,
  },
  maxHttpBufferSize: 1e7,
});

io.setMaxListeners(20);

io.use(verifyUserToken).on("connection", async (socket) => {
  logger.info(`socket connected successfully. ===> ${socket.id}`);
  await chatSocket(io, socket);
  await onlineUsersSocket(io, socket);
  userTypingSocket(io, socket);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log("unhandledRejection error ===>", err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("warning", (e) => console.warn(e.stack));

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    console.log("Server closed.");
    process.exit(1);
  }
});
