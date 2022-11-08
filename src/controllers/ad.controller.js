const {
  getAdsDatastore,
  getAdByNameDatastore,
  createAdDatastore,
  updateAdDatastore,
  deleteAdDatastore,
} = require("../services/ad/ad");

const getAds = async (req, res) => {
  try {
    const adName = req.query.name;
    if (adName) {
      const data = await getAdByNameDatastore(adName);
      res.json(data);
      res.status(200);
    } else {
      const pageCursor = req.query.pageCursor;
      const data = await getAdsDatastore(pageCursor);
      res.json(data);
      res.status(200);
    }
  } catch (error) {
    res.json("Error while downloading the advertisements");
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
};

const updateAd = async (req, res) => {
  const adName = req.query.name;
  try {
    await updateAdDatastore({ name: adName, data: req.body });
    res.status(200);
    res.send("Ad was updated");
  } catch (error) {
    res.send("The advertisement cannot be updated");
    res.status(500);
  }
};

const deleteAd = async (req, res) => {
  const adName = req.query.name;
  try {
    await deleteAdDatastore(adName);
    res.status(200);
    res.send("Ad was deleted");
  } catch (error) {
    res.send("The advertisement cannot be deleted");
    res.status(500);
  }
};

module.exports = { getAds, createAd, updateAd, deleteAd };
