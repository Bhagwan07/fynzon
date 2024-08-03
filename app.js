const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const useragent = require("express-useragent");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const { globalErrorHandler } = require("./utils/globalErrorHandler");

// START EXPRESS APP ..
const app = express();
console.log("Running environment is ===>", app.get("env"));

// GLOBAL MIDDLEWARES ..
app.use(helmet());

//development logging
if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}

//prase json request url
app.use(express.json());

//parse json request body
app.use(express.urlencoded({ extended: true }));

//Express can read ip address from headers if it runs behind a proxy.To enable this, add the following line
app.set("trust proxy", true);

//middleware to expose user-agent details to the application
app.use(useragent.express());

//data sanitisation against NoSql query injection
app.use(mongoSanitize());

//data sanitisation against xss

app.use(xss());

//allow cross origin requets
app.use(cors());

// ROUTE IMPORTS
const userRouter = require("./routers/userAuthRouter");
const { AppError } = require("./utils/AppError");

// ROUTE DECLERATIONS ..
app.use("/user", userRouter);

//check whether requested url exist on this server or not
app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;
