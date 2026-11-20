
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

describe("Pruebas funcionales - Swagger", function () {
  describe("GET /api/docs.json", function () {
    it("debe entregar la especificación OpenAPI", async function () {
      const response = await request(app).get("/api/docs.json");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("openapi", "3.0.3");
      expect(response.body).to.have.property("info");
      expect(response.body.info).to.have.property("title", "ShipNow API");
      expect(response.body.info).to.have.property("version", "1.0.0");
      expect(response.body).to.have.property("paths").that.is.an("object");

      expect(response.body.paths).to.have.property("/api/users");
      expect(response.body.paths).to.have.property("/api/products");
      expect(response.body.paths).to.have.property("/api/orders");
    });
  });

  describe("GET /api/docs", function () {
    it("debe mostrar la interfaz Swagger UI", async function () {
      const response = await request(app).get("/api/docs/");

      expect(response.status).to.equal(200);
      expect(response.text).to.be.a("string");
      expect(response.text).to.include("swagger-ui");
      expect(response.text).to.include("swagger-ui-bundle.js");
    });
  });
});
