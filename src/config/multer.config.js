const multer = require("multer");
const path = require("path");
const fs = require("fs");

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const UPLOAD_DIRECTORIES = {
  USER_DOCUMENT: path.resolve(process.cwd(), "uploads/users"),
  DELIVERY_PROOF: path.resolve(process.cwd(), "uploads/deliveries"),
};

function createStorage(destination) {
  fs.mkdirSync(destination, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, destination);
    },

    filename: (req, file, callback) => {
      const extension = ALLOWED_MIME_TYPES[file.mimetype];
      const uniqueName = `${Date.now()}-${require("crypto").randomUUID()}${extension}`;

      callback(null, uniqueName);
    },
  });
}

function fileFilter(req, file, callback) {
  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    const error = new Error("Tipo de archivo no permitido.");
    error.code = "INVALID_FILE_TYPE";
    return callback(error);
  }

  callback(null, true);
}

function createUpload(destination) {
  return multer({
    storage: createStorage(destination),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
    },
    fileFilter,
  });
}

module.exports = {
  userDocumentUpload: createUpload(UPLOAD_DIRECTORIES.USER_DOCUMENT),
  deliveryProofUpload: createUpload(UPLOAD_DIRECTORIES.DELIVERY_PROOF),
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  UPLOAD_DIRECTORIES,
};
