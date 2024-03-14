const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/v1/testIp", (req, res, next) => {
  try {
    const serverIp = req.connection.remoteAddress;
    console.log("Server IP:", serverIp);
    console.log("hi");
   console.log("Remote IP:", req.ip);
    res.status(200).json({
      ServerIP:serverIp,
      ip:req.ip,
      error:false
    })
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Express running on port" + `${port}`);
});


