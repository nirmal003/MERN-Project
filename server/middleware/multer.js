const multer = require("multer");

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("file");

const multiUpload = multer({ storage }).array("files");

module.exports = { singleUpload, multiUpload };
