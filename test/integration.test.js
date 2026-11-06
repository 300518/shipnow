const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

describe("Pruebas de integración HTTP", () => {
  it("debe responder 400 cuando la cantidad de mocks es inválida", async () => {
    const response = await request(app)
      .get("/api/mocks/users")
      .query({ qty: 0 });

    assert.equal(response.status, 400);
    assert.equal(response.body.exito, false);
    assert.equal(response.body.error.codigo, "INVALID_MOCK_QUANTITY");
    assert.equal(
      response.body.error.mensaje,
      "La cantidad debe ser un entero entre 1 y 50."
    );
    assert.equal(response.body.error.detalles.parametro, "qty");
    assert.equal(response.body.error.detalles.valor, "0");
  });
  it("debe generar usuarios cuando la cantidad es válida", async () => {
    const response = await request(app)
      .get("/api/mocks/users")
      .query({ qty: 3 });

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 3);

    response.body.forEach((usuario) => {
      assert.ok(usuario._id);
      assert.ok(usuario.name);
      assert.ok(usuario.email);
      assert.ok(usuario.role);
    });
  });
  it("debe responder 404 cuando la ruta no existe", async () => {
    const response = await request(app).get("/api/ruta-inexistente");

    assert.equal(response.status, 404);
    assert.equal(response.body.exito, false);
    assert.equal(response.body.error.codigo, "ROUTE_NOT_FOUND");
    assert.equal(response.body.error.mensaje, "La ruta solicitada no existe.");
  });
});
