const config = require("./config/env.config");
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./config/logger.config");

async function startServer() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    logger.info("Conexión a MongoDB establecida");
    app.listen(config.PORT, () => {
      logger.info("ShipNow API iniciada correctamente", {
        puerto: config.PORT,
        entorno: process.env.NODE_ENV,
      });
    });
  } catch (error) {
    logger.fatal("No se pudo iniciar ShipNow", {
      mensaje: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
}

startServer();
