const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

let corsOptions = {
  origin: "http://localhost:8081",
};

const adRoutes = require("./routers/adRouter.js");
const uploadRoutes = require("./routers/uploadRouter");

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/", adRoutes);
app.use("/image", uploadRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
