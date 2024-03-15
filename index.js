const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/v1/testIp", (req, res, next) => {
  try {
    fetch("https://apiv2.fynzon.com/shared/test/api/v1/testing").then(
      (response) => {
        response.json().then((data) => {
          console.log(data)
          res.status(200).json(data);
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Express running on port" + `${port}`);
});


