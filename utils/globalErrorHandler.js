exports.globalErrorHandler = async (err, req, res, next) => {
  err.statusCode = err?.statusCode || 500;
  err.message = err?.message || "Internal sever error";

  if (process.env.NODE_ENV === "PRODUCTION") {
    if (err?.isOperational) {
      // trusted error : send message to client
      res.status(err.statusCode).json({
        message: err.message,
        error: true,
        data: null,
      });
    } else {
      // unknown error : dont leak error details
      res.status(500).json({
        message: err?.message || "Something went wrong!",
        error: true,
        data: null,
      });
    }
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      message: err.message,
      error: true,
      data: null,
      completeErr: err,
      stack: err.stack,
    });
  }
};
