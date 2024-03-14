const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
const expressip = require("express-ip");
app.use(expressip().getIpInfoMiddleware);

app.get("/api/v1/testIp", (req, res, next) => {
  try {
   console.log(req.headers["x-real-ip"]);
    res.send({
      ip:req.headers["x-real-ip"]
    })
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Express running on port" + `${port}`);
});
