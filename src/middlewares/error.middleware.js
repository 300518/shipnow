const AppError = require("../errors/app.error");
const ERRORES = require("../errors/error.dictionary");

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Errores personalizados de la aplicación
  if (err instanceof AppError) {
    return res.status(err.estado).json({
      exito: false,
      error: {
        codigo: err.codigo,
        mensaje: err.message,
        ...(err.detalles && { detalles: err.detalles }),
      },
    });
  }

  // Error de validación de MongoDB
  if (err.name === "ValidationError") {
    return res.status(400).json({
      exito: false,
      error: {
        codigo: "INVALID_DATA",
        mensaje: "Los datos enviados no son válidos.",
      },
    });
  }

  // ID de MongoDB con formato incorrecto
  if (err.name === "CastError") {
    return res.status(400).json({
      exito: false,
      error: {
        codigo: "INVALID_ID",
        mensaje: "El identificador enviado no es válido.",
      },
    });
  }

  // Registro duplicado en MongoDB
  if (err.code === 11000) {
    return res.status(409).json({
      exito: false,
      error: {
        codigo: "RESOURCE_ALREADY_EXISTS",
        mensaje: "El recurso ya existe.",
      },
    });
  }

  // Error interno no controlado
  return res.status(ERRORES.ERROR_INTERNO.estado).json({
    exito: false,
    error: {
      codigo: ERRORES.ERROR_INTERNO.codigo,
      mensaje: ERRORES.ERROR_INTERNO.mensaje,
    },
  });
}

module.exports = errorMiddleware;
