const express = require("express");
router = express.Router();

const {
  getAds,
  createAd,
  updateAd,
  deleteAd,
} = require("../controllers/adController");

router.get("/", getAds);

router.post("/", createAd);

router.patch("/", updateAd);

router.delete("/", deleteAd);

module.exports = router;
