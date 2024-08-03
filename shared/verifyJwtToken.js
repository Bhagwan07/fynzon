const jwt = require("jsonwebtoken");

exports.verifyJwtToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
    });

    if (!decodedToken) {
      return {
        message: "Error in token verification",
        error: true,
        data: null,
      };
    }

    return {
      message: "Token verified successfully",
      error: false,
      data: decodedToken,
    };
  } catch (err) {
    return {
      message:
        err.name === "TokenExpiredError"
          ? process.env.TOKEN_ERROR_MESSAGE
          : err.name === "JsonWebTokenError"
          ? process.env.TOKEN_ERROR_MESSAGE
          : err.name === "NotBeforeError"
          ? process.env.TOKEN_ERROR_MESSAGE
          : "Token is missing",
      error: true,
      data: null,
    };
  }
};
