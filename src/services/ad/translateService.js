const { translate } = require("../../config/database/translate");

const translateText = async (text, target) => {
  try {
    const [translation] = await translate.translate(text, target);
    console.log([translation]);
    return [translation];
  } catch (error) {
    return error;
  }
};

module.exports = { translateText };
