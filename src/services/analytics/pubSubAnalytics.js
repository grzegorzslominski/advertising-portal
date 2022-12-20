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

const findTextInLanguage =  (translationData, language = 'en') => {
  return translationData.find((text) => text.language === language).data;
}
    
const publishTranslationDataToAnalysis = (translationData) => {
  const translationDataToAnalysis = {
    adName: translationData.adName,
    date: translationData.date,
    enText: findTextInLanguage(translationData.translation, 'en'),
    plText: findTextInLanguage(translationData.translation, 'pl'),
    deText: findTextInLanguage(translationData.translation, 'de'),
  }

  publishMessage(
    pubSubClient,
    process.env.TRANSLATION_ANALYTICS_TOPIC,
    translationDataToAnalysis
  );
    
}

const publishImageDataToAnalysis = () => {
  
}

module.exports = { publishAdDataToAnalysis, publishTranslationDataToAnalysis, publishImageDataToAnalysis };
