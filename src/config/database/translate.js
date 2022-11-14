const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate();

module.exports = { translate };
