const util = require("util");
const Multer = require("multer");

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: process.env.FILE_MAX_SIZE },
}).single("file");

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
