const { PubSub, v1 } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const pubSubClient2 = new v1.PublisherClient();
const pubsubRepository = require("../../repositories/pubSubRepo");

const { publishMessage } = pubsubRepository;

const publishAdDataToAnalysis = (adData) => {
  const adDataToAnalysis = {
    name: adData.name,
    creationData: adData.creationData,
    price: adData.price,
  };
  publishMessage(
    pubSubClient,
    process.env.AD_ANALYTICS_TOPIC,
    adDataToAnalysis
  );
};

module.exports = { publishAdDataToAnalysis };
