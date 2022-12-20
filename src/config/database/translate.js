const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate();

const targetLanguages = ["en", "pl", "de"];

module.exports = { translate, targetLanguages };
