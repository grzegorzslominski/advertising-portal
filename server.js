const express = require("express");
const bodyParser = require("body-parser");
const { createAd } = require("./src/modules/ad/ad.db");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello");
});

app.post("/ad", (req, res) => {
  res.send(createAd(req.body));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// app.post("/ad", (req, res) => {
//   async () => {
//     const response = await createAd(req.body);
//     res.send(response);
//   };
// });
