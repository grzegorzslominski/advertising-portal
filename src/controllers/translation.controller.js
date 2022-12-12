const { PubSub } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const subscriptionName = "translation-sub";
const timeout = 60;
const pubsubRepository = require("../repositories/pubSubRepo");
const { listenForPullMessages, listenForPushMessages } = pubsubRepository;

// const { updateAdDatastore } = require("../services/ad/ad");

// const { translateText } = require("../services/ad/translateService");
// const { targetLanguages } = require("../config/database/translate");

// const translateDescription = async (req, res) => {
//   try {
//     const translatedText = await translateText(
//       req.body.description,
//       targetLanguages
//     );
//     await updateAdDatastore({
//       name: req.params.adName,
//       data: { translatedText: translatedText },
//     });
//     res.status(200);
//     res.json(translatedText);
//   } catch (error) {
//     res.send("Failed to translate text");
//     res.status(500);
//   }
// };

const pullTranslation = (req, res) => {
  try {
    listenForPullMessages(pubSubClient, subscriptionName, timeout);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't receive orders object :(",
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

    await updateAdDatastore({
      name: messageResponse.adName,
      data: { translatedText: translatedText },
    });

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
