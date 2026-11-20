
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

describe("Pruebas funcionales - Logger", function () {
  describe("GET /api/logger/test", function () {
    it("debe ejecutar la prueba de logging correctamente", async function () {
      const response = await request(app).get("/api/logger/test");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("exito", true);
      expect(response.body).to.have.property(
        "mensaje",
        "Prueba de logging ejecutada correctamente."
      );
      expect(response.body.niveles).to.deep.equal([
        "fatal",
        "error",
        "warning",
        "info",
        "http",
        "debug",
      ]);
    });
  });

  describe("Ruta inexistente", function () {
    it("debe devolver error estandarizado para una ruta inexistente", async function () {
      const response = await request(app).get("/api/logger/ruta-inexistente");

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "ROUTE_NOT_FOUND");
      expect(response.body.error).to.have.property("mensaje").that.is.a("string");
    });
  });
});
