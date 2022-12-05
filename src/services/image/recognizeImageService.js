const vision = require("@google-cloud/vision");

async function recognizeImageLabels(fileName) {
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.labelDetection(
    `gs://${process.env.GCLOUD_STORAGE}/${fileName}`
  );
  const labels = result.labelAnnotations;

  return labels;
}

module.exports = { recognizeImageLabels };
