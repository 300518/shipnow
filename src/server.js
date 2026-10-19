const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/env.config");

async function startServer() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    console.log("Conexión a MongoDB establecida.");

    app.listen(config.PORT, () => {
      console.log(
        `ShipNow API ejecutándose en http://localhost:${config.PORT}`
      );
    });
  } catch (error) {
    console.error("No se pudo iniciar ShipNow:", error.message);
    process.exit(1);
  }
}

startServer();
