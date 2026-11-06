const logger = require("../config/logger.config");

class LoggerController {
  test(req, res) {
    logger.fatal("Prueba de nivel FATAL");
    logger.error("Prueba de nivel ERROR");
    logger.warning("Prueba de nivel WARNING");
    logger.info("Prueba de nivel INFO");
    logger.http("Prueba de nivel HTTP");
    logger.debug("Prueba de nivel DEBUG");

    return res.status(200).json({
      exito: true,
      mensaje: "Prueba de logging ejecutada correctamente.",
      niveles: ["fatal", "error", "warning", "info", "http", "debug"],
    });
  }
}

module.exports = new LoggerController();
