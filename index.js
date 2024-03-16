const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/v1/testIp", (req, res, next) => {
  try {
  fetch("https://testapi.virtualgaintechnologies.com/yb/payout/api/v1/merchant/payment", {
  method:"POST",
  headers: {
    "api-key-id": "api_prod.lZuol5My9gDSM8X1LsMwTt3q1",
    "api-secret-key": "j4IIVWCoOv0vZox"
  },
  body:{
    "ifscCode":"YESB0000262",
    "accountNumber":"026291800001191",    "transferType":"IMPS",
    "amount":110,    "uniqueId":"IO00876UeyeyYEWEYTEhu2"
  }
}).then((data)=>{
  data.json().then((data)=>{
    console.log(data)
    res.status(200).json(data)
  })
});
    
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Express running on port" + `${port}`);
});


