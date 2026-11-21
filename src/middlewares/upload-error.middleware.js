const multer = require("multer");
const AppError = require("../errors/app.error");
const logger = require("../config/logger.config");

const UPLOAD_ERRORS = {
  LIMIT_FILE_SIZE: {
    codigo: "FILE_TOO_LARGE",
    mensaje: "El archivo supera el tamaño máximo permitido de 5 MB.",
    estado: 400,
  },
  LIMIT_FILE_COUNT: {
    codigo: "TOO_MANY_FILES",
    mensaje: "Solo se permite cargar un archivo.",
    estado: 400,
  },
  LIMIT_UNEXPECTED_FILE: {
    codigo: "UNEXPECTED_FILE_FIELD",
    mensaje: "El campo del archivo no es válido. Utiliza 'file'.",
    estado: 400,
  },
  INVALID_FILE_TYPE: {
    codigo: "INVALID_FILE_TYPE",
    mensaje: "El tipo de archivo no está permitido. Utiliza PDF, JPG o PNG.",
    estado: 400,
  },
};

function uploadErrorMiddleware(err, req, res, next) {
  const definition = UPLOAD_ERRORS[err.code];

  if (err instanceof multer.MulterError || definition) {
    const errorDefinition = definition || {
      codigo: "UPLOAD_ERROR",
      mensaje: "No fue posible cargar el archivo.",
      estado: 400,
    };

    logger.warning("Error durante la carga de archivo", {
      codigo: errorDefinition.codigo,
      mensaje: errorDefinition.mensaje,
      nombreArchivo: req.file?.originalname,
      tipoArchivo: req.file?.mimetype,
      ruta: req.originalUrl,
      metodo: req.method,
    });

    const appError = new AppError(errorDefinition);
    appError.uploadErrorLogged = true;

    return next(appError);
  }

  return next(err);
}

module.exports = uploadErrorMiddleware;
