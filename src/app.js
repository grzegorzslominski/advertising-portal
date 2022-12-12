const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

let corsOptions = {
  origin: "http://localhost:8081",
};

const ad = require("./routers/ad");
const fileUpload = require("./routers/fileUpload");
const translation = require("./routers/translation");

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/ad", ad);
app.use("/image", fileUpload);
app.use("/translation", translation);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
