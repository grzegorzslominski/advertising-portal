const {
  getAdsDatastore,
  getAdByNameDatastore,
  createAdDatastore,
  updateAdDatastore,
  deleteAdDatastore,
} = require("../services/ad/ad");

const { translateText } = require("../services/ad/translateService");

const { targetLanguages } = require("../config/database/translate");

const getAds = async (req, res) => {
  try {
    const pageCursor = req.query.pageCursor;
    const data = await getAdsDatastore(pageCursor);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.json("Error while downloading the advertisements");
    res.status(500);
  }
};

const getAdByName = async (req, res) => {
  try {
    const data = await getAdByNameDatastore(req.params.name);
    res.json(data);
    res.status(200);
  } catch (error) {
    res.json("Error while downloading the advertisement");
    res.status(500);
  }
};

const createAd = async (req, res) => {
  try {
    await createAdDatastore(req.body);
    res.status(201);
    res.send("New ad was created");
  } catch (error) {
    res.send("New advertisement could not be added");
    res.status(500);
  }

  const translatedText = await translateText(
    req.body.description,
    targetLanguages
  );
  if (translatedText) {
    try {
      await updateAdDatastore({
        name: req.body.name,
        data: { translations: translatedText },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

const updateAd = async (req, res) => {
  try {
    await updateAdDatastore({ name: req.params.name, data: req.body });
    res.status(200);
    res.send("Ad was updated");
  } catch (error) {
    res.send("The advertisement cannot be updated");
    res.status(500);
  }
};

const deleteAd = async (req, res) => {
  try {
    await deleteAdDatastore(req.params.name);
    res.status(200);
    res.send("Ad was deleted");
  } catch (error) {
    res.send("The advertisement cannot be deleted");
    res.status(500);
  }
};

module.exports = { getAds, getAdByName, createAd, updateAd, deleteAd };
