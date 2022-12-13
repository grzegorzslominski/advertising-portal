const express = require("express");
router = express.Router();

const {
  upload,
  getListFiles,
  download,
  pushImageRecognize,
} = require("../controllers/fileUpload.controller");

router.post("/upload/:adName", upload);
router.get("/files", getListFiles);
router.get("/files/:name", download);
router.post("/recognize/push", pushImageRecognize);

module.exports = router;
