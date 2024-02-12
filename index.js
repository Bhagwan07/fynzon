const express = require("express");
const app = express();
const dns = require("dns");

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
      res.send(addresses);
    });
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Express running on port" + `${port}`);
});
