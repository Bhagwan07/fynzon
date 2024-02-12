const express = require("express");
const app = express();
const dns = require("dns");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.get("/api/v1/testIp", (req, res, next) => {
  try {
    const hostname = req.hostname;
    // const hostname = "testapi.fynzon.com";
    let ip;
    dns.resolve(hostname, (err, addresses) => {
      if (err) {
        console.error(`Failed to resolve ${hostname}: ${err}`);
        return;
      }

      console.log(`IP addresses for ${hostname}:`);
      addresses.forEach((address, index) => {
        console.log(`- ${address}`);
      });
      ip = addresses;
      const clientIP = req.connection.remoteAddress;
      const ipreq = req.ip;
      res.send({ clientIP, ipreq });
    });
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Express running on port" + `${port}`);
});
