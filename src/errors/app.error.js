class AppError extends Error {
  constructor(errorDefinicion, detalles = null, mensaje = null) {
    super(mensaje || errorDefinicion.mensaje);

    this.name = "AppError";
    this.codigo = errorDefinicion.codigo;
    this.estado = errorDefinicion.estado;
    this.statusCode = errorDefinicion.estado;
    this.detalles = detalles;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
