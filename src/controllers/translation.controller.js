const moment = require("moment");

const { PubSub } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const subscriptionName = "translation-sub";
const timeout = 60;
const pubsubRepository = require("../repositories/pubSubRepo");
const { listenForPullMessages, listenForPushMessages } = pubsubRepository;

const { updateAdDatastore } = require("../services/ad/adService");
const { translateText } = require("../services/ad/translateService");
const { targetLanguages } = require("../config/database/translate");
const { publishTranslationDataToAnalysis } =  require("../services/analytics/pubSubAnalytics")

const pullTranslation = (req, res) => {
  try {
    listenForPullMessages(pubSubClient, subscriptionName, timeout);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't receive ad object",
      data: error,
    });
  }
};

const pushTranslation = async (req, res) => {
  try {
    let messageResponse = await listenForPushMessages(req.body.message.data);
    const translatedText = await translateText(
      messageResponse.description,
      targetLanguages
    );

    const currentDate = moment.utc().format("YYYY-MM-DD HH:mm:ss")

    await updateAdDatastore({
      name: messageResponse.adName,
      data: { translatedText: translatedText },
      translationDate: currentDate, 
    });

    publishTranslationDataToAnalysis({adName: messageResponse.adName, translation: translatedText, date: currentDate})

    return res.status(200).json({
      success: true,
      message: "Ad description was translated and ad was updated",
      data: messageResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't update ad",
      data: error,
    });
  }
};
module.exports = { pullTranslation, pushTranslation };
