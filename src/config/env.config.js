const dotenv = require("dotenv");

dotenv.config();

const requiredVariables = ["PORT", "MONGODB_URI", "NODE_ENV"];

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Error de configuración: faltan las variables ${missingVariables.join(
      ", "
    )}`
  );
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Error de configuración: PORT debe ser un puerto válido.");
}

const allowedEnvironments = ["development", "production", "test"];

if (!allowedEnvironments.includes(process.env.NODE_ENV)) {
  throw new Error(
    "Error de configuración: NODE_ENV debe ser development, production o test."
  );
}

module.exports = Object.freeze({
  PORT: port,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
});
