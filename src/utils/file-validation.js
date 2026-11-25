const fs = require("fs/promises");

const FILE_SIGNATURES = {
  "application/pdf": (buffer) => buffer.subarray(0, 5).toString() === "%PDF-",

  "image/jpeg": (buffer) =>
    buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,

  "image/png": (buffer) =>
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
};

async function validateFileContent(file) {
  if (!file) {
    return false;
  }

  const validateSignature = FILE_SIGNATURES[file.mimetype];

  if (!validateSignature) {
    return false;
  }

  const handle = await fs.open(file.path, "r");

  try {
    const buffer = Buffer.alloc(8);
    const { bytesRead } = await handle.read(buffer, 0, 8, 0);

    return validateSignature(buffer.subarray(0, bytesRead));
  } finally {
    await handle.close();
  }
}

module.exports = { validateFileContent };
