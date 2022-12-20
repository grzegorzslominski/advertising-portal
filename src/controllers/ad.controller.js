const { PubSub, v1 } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const pubSubClient2 = new v1.PublisherClient();

const pubsubRepository = require("../repositories/pubSubRepo");
const { publishMessage } = pubsubRepository;
const {
  publishAdDataToAnalysis,
} = require("../services/analytics/pubSubAnalytics");

const {
  getAdsDatastore,
  getAdByNameDatastore,
  createAdDatastore,
  updateAdDatastore,
  deleteAdDatastore,
} = require("../services/ad/adService");

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
    const newAd = await createAdDatastore(req.body);

    const translationData = {
      adName: req.body.name,
      description: req.body.description,
    };
    await publishMessage(
      pubSubClient,
      process.env.TRANSLATION_TOPIC,
      translationData
    );

    publishAdDataToAnalysis(newAd.data);

    return res.status(201).send({
      message:
        "The advertisement has been added and the description has been sent for translation",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "New advertisement could not be added",
    });
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

module.exports = {
  getAds,
  getAdByName,
  createAd,
  updateAd,
  deleteAd,
};
