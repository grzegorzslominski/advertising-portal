const { PubSub } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const processFile = require("../middleware/upload");
const { format } = require("util");
const { bucket } = require("../config/database/storage");
const {
  recognizeImageLabels,
} = require("../services/image/recognizeImageService");
const { updateAdDatastore } = require("../services/ad/adService");
const { publishMessage } = require("../repositories/pubSubRepo");

const upload = async (req, res) => {
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      const imageRecognizeData = {
        adName: req.params.adName,
        fileName: req.file.originalname,
      };

      try {
        bucket.file(req.file.originalname);
        await publishMessage(
          pubSubClient,
          process.env.IMAGE_RECOGNIZE_TOPIC,
          imageRecognizeData
        );
      } catch {
        return res.status(500).send({
          message: `Uploaded the file successfully: ${req.file.originalname}, but image recognize is failed`,
          url: publicUrl,
        });
      }

      res.status(200).send({
        message:
          "File upload and recognition successful: " + req.file.originalname,
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });

    res.status(200).send(fileInfos);
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Unable to read list of files!",
    });
  }
};

const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    res.status(500).send({
      message: "Could not download the file. " + err,
    });
  }
};

const pushImageRecognize = async (req, res) => {
  try {
    let messageResponse = await listenForPushMessages(req.body.message.data);
    const labels = await recognizeImageLabels(messageResponse.fileName);
    await updateAdDatastore({
      name: messageResponse.adName,
      data: { imageLabels: labels },
    });

    return res.status(200).json({
      success: true,
      message: "Successfully added image labels",
      data: messageResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not recognize labels from image",
      data: error,
    });
  }
};

module.exports = {
  upload,
  getListFiles,
  download,
  pushImageRecognize,
};
