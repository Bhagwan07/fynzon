const express = require("express");
const app = express();
const dns = require("dns");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.get("/api/v1/testIp", (req, res, next) => {
  try {
    const ipreq = req.ip;
    const clientIP =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(clientIP);
    res.send({ clientIP, ipreq });
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Express running on port" + `${port}`);
});
