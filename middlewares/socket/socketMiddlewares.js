const { getUserByFilter } = require("../../services/userAuthServices");
const { verifyJwtToken } = require("../../shared/verifyJwtToken");
const { AppError } = require("../../utils/AppError");

exports.verifyUserToken = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      throw new AppError(401, "Unauthorised user");
    }

    const isTokenVerified = await verifyJwtToken(token);
    if (isTokenVerified.error) {
      throw new AppError(400, isTokenVerified.message);
    }

    const user = await getUserByFilter(
      { token },
      "_id first_name last_name email profile_image",
      { lean: true }
    );
    if (!user) {
      throw new AppError(400, "Failed to get user profile");
    }

    socket.userId = user._id;
    next();
  } catch (err) {
    socket.emit("error", "Internal server error");
  }
};
