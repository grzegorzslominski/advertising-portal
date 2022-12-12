const express = require("express");
router = express.Router();

const {
  pullTranslation,
  pushTranslation,
} = require("../controllers/translation.controller");

router.post("/pull", pullTranslation);
router.post("/push", pushTranslation);

module.exports = router;
