const { Storage } = require("@google-cloud/storage");

const storage = new Storage();
const bucket = storage.getBuckets(process.env.GCLOUD_STORAGE);

module.exports = { bucket };
