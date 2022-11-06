const express = require("express");
require("dotenv").config();

const bodyParser = require("body-parser");

const adRoutes = require("./routers/adRouter.js");

const app = express();
app.use(bodyParser.json());

app.use("/", adRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
