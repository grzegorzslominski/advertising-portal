const { translate } = require("../../config/database/translate");

const translateText = async (text, targetLanguages) => {
  try {
    const promises = [];

    targetLanguages.forEach((language) => {
      new Promise((resolve, reject) => {
        promises.push({
          resolve: () => translate.translate(text, language),
          reject: reject,
          language: language,
        });
      });
    });

    let translatedText;

    await Promise.all(
      promises.map(async (translateService) => {
        return {
          data: await translateService.resolve(),
          language: translateService.language,
        };
      })
    )
      .then((resolvedValues) => {
        translatedText = resolvedValues.map((translationData) => {
          return { ...translationData, data: translationData.data[0] };
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return translatedText;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { translateText };
