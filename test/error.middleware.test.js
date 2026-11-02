const { test } = require("node:test");
const assert = require("node:assert/strict");

const AppError = require("../src/errors/app.error");
const ERRORES = require("../src/errors/error.dictionary");
const errorMiddleware = require("../src/middlewares/error.middleware");

// Simula una respuesta de Express.
function crearRespuesta() {
  return {
    statusCode: null,
    body: null,
    headersSent: false,

    status(codigo) {
      this.statusCode = codigo;
      return this;
    },

    json(datos) {
      this.body = datos;
      return this;
    },
  };
}

test("middleware responde correctamente a errores personalizados", () => {
  const res = crearRespuesta();
  const error = new AppError(ERRORES.USUARIO_NO_ENCONTRADO);

  errorMiddleware(error, {}, res, () => {});

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.exito, false);
  assert.equal(res.body.error.codigo, "USER_NOT_FOUND");
});

test("middleware responde con HTTP 500 ante errores inesperados", () => {
  const res = crearRespuesta();
  const error = new Error("Error interno de prueba");

  errorMiddleware(error, {}, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.equal(res.body.error.codigo, "INTERNAL_SERVER_ERROR");
});

test("middleware no expone detalles internos de errores inesperados", () => {
  const res = crearRespuesta();
  const error = new Error("Información privada de MongoDB");

  errorMiddleware(error, {}, res, () => {});

  assert.equal(JSON.stringify(res.body).includes("Información privada"), false);
});

test("middleware delega errores si la respuesta ya fue enviada", () => {
  const res = crearRespuesta();
  res.headersSent = true;

  let errorRecibido = null;
  const error = new Error("Error de prueba");

  errorMiddleware(error, {}, res, (errorDelegado) => {
    errorRecibido = errorDelegado;
  });

  assert.equal(errorRecibido, error);
});

test("middleware responde HTTP 400 ante errores de validación de MongoDB", () => {
  const res = crearRespuesta();
  const error = new Error("Error de validación");
  error.name = "ValidationError";

  errorMiddleware(error, {}, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.exito, false);
  assert.equal(res.body.error.codigo, "INVALID_DATA");
});

test("middleware responde HTTP 400 ante IDs de MongoDB inválidos", () => {
  const res = crearRespuesta();
  const error = new Error("Cast error");
  error.name = "CastError";

  errorMiddleware(error, {}, res, () => {});

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.exito, false);
  assert.equal(res.body.error.codigo, "INVALID_ID");
});

test("middleware responde HTTP 409 ante registros duplicados", () => {
  const res = crearRespuesta();
  const error = new Error("Correo duplicado");
  error.code = 11000;

  errorMiddleware(error, {}, res, () => {});

  assert.equal(res.statusCode, 409);
  assert.equal(res.body.exito, false);
  assert.equal(res.body.error.codigo, "RESOURCE_ALREADY_EXISTS");
});
