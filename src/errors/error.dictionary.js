const ERRORES = Object.freeze({
  ERROR_INTERNO: {
    codigo: "INTERNAL_SERVER_ERROR",
    mensaje: "Error interno del servidor.",
    estado: 500,
  },

  DATOS_INVALIDOS: {
    codigo: "INVALID_DATA",
    mensaje: "Los datos enviados no son válidos.",
    estado: 400,
  },

  USUARIO_NO_ENCONTRADO: {
    codigo: "USER_NOT_FOUND",
    mensaje: "El usuario no existe.",
    estado: 404,
  },

  PRODUCTO_NO_ENCONTRADO: {
    codigo: "PRODUCT_NOT_FOUND",
    mensaje: "Producto no encontrado.",
    estado: 404,
  },

  PEDIDO_NO_ENCONTRADO: {
    codigo: "ORDER_NOT_FOUND",
    mensaje: "El pedido no existe.",
    estado: 404,
  },

  ENTREGA_NO_ENCONTRADA: {
    codigo: "DELIVERY_NOT_FOUND",
    mensaje: "La entrega no existe.",
    estado: 404,
  },

  ESTADO_INVALIDO: {
    codigo: "INVALID_STATUS",
    mensaje: "El estado enviado no es válido.",
    estado: 400,
  },

  CANTIDAD_MOCK_INVALIDA: {
    codigo: "INVALID_MOCK_QUANTITY",
    mensaje: "La cantidad debe ser un entero entre 1 y 50.",
    estado: 400,
  },

  ERROR_AL_CARGAR_MOCKS: {
    codigo: "MOCK_SEED_ERROR",
    mensaje: "No fue posible cargar los datos de prueba.",
    estado: 500,
  },

  RECURSO_DUPLICADO: {
    codigo: "RESOURCE_ALREADY_EXISTS",
    mensaje: "El recurso ya existe.",
    estado: 409,
  },
});

module.exports = ERRORES;
