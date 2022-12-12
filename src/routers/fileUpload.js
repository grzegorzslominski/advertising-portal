const express = require("express");
router = express.Router();

const {
  upload,
  getListFiles,
  download,
  recognizeLabels,
} = require("../controllers/file.controller");

router.post("/upload/:adName", upload);
router.get("/files", getListFiles);
router.get("/files/:name", download);
router.post("/recognize/:adName", recognizeLabels);

module.exports = router;
