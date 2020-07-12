const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png|PNG)$/)) {
      cb(new Error("Please upload an image (jpg/png)"));
    }

    cb(undefined, true);
  }
});

module.exports = upload;