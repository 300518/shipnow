const AppError = require("./app.error");
const ERRORES = require("./error.dictionary");

class UsuarioNoEncontradoError extends AppError {
  constructor() {
    super(ERRORES.USUARIO_NO_ENCONTRADO);
  }
}

class ProductoNoEncontradoError extends AppError {
  constructor() {
    super(ERRORES.PRODUCTO_NO_ENCONTRADO);
  }
}

class PedidoNoEncontradoError extends AppError {
  constructor() {
    super(ERRORES.PEDIDO_NO_ENCONTRADO);
  }
}

class EntregaNoEncontradaError extends AppError {
  constructor() {
    super(ERRORES.ENTREGA_NO_ENCONTRADA);
  }
}

class EstadoInvalidoError extends AppError {
  constructor(detalles = null) {
    super(ERRORES.ESTADO_INVALIDO, detalles);
  }
}

class CantidadMockInvalidaError extends AppError {
  constructor(detalles = null) {
    super(ERRORES.CANTIDAD_MOCK_INVALIDA, detalles);
  }
}

class ErrorAlCargarMocks extends AppError {
  constructor() {
    super(ERRORES.ERROR_AL_CARGAR_MOCKS);
  }
}

class RecursoDuplicadoError extends AppError {
  constructor(detalles = null) {
    super(ERRORES.RECURSO_DUPLICADO, detalles);
  }
}

class DatosInvalidosError extends AppError {
  constructor(detalles = null, mensaje = null) {
    super(ERRORES.DATOS_INVALIDOS, detalles, mensaje);
  }
}

module.exports = {
  UsuarioNoEncontradoError,
  ProductoNoEncontradoError,
  PedidoNoEncontradoError,
  EntregaNoEncontradaError,
  EstadoInvalidoError,
  CantidadMockInvalidaError,
  ErrorAlCargarMocks,
  RecursoDuplicadoError,
  DatosInvalidosError,
};
