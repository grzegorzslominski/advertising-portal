const express = require("express");
router = express.Router();

const {
  getAds,
  getAdByName,
  createAd,
  updateAd,
  deleteAd,
  translateDescription,
} = require("../controllers/ad.controller");

router.get("/ads/", getAds);

router.get("/ads/:name", getAdByName);

router.post("/create", createAd);

router.patch("/update/:name", updateAd);

router.delete("/remove/:name", deleteAd);

router.post("/translate", translateDescription);

module.exports = router;
