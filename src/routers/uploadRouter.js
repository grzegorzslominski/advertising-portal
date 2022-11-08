const express = require("express");
router = express.Router();

const {
  upload,
  getListFiles,
  download,
} = require("../controllers/file.controller");

router.post("/upload", upload);
router.get("/files", getListFiles);
router.get("/files/:name", download);

module.exports = router;
