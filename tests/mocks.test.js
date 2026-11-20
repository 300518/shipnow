
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");

describe("Pruebas funcionales - Mocks", function () {
  describe("GET /api/mocks/users", function () {
    it("debe generar la cantidad solicitada de usuarios", async function () {
      const response = await request(app).get("/api/mocks/users?qty=3");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array").with.lengthOf(3);
      expect(response.body[0]).to.have.property("name");
      expect(response.body[0]).to.have.property("email");
      expect(response.body[0]).to.have.property("role");
    });

    it("debe rechazar una cantidad inválida", async function () {
      const response = await request(app).get("/api/mocks/users?qty=0");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "INVALID_MOCK_QUANTITY"
      );
    });
  });

  describe("GET /api/mocks/couriers", function () {
    it("debe generar repartidores con el rol correspondiente", async function () {
      const response = await request(app).get("/api/mocks/couriers?qty=2");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array").with.lengthOf(2);
      expect(response.body[0]).to.have.property("role", "COURIER");
      expect(response.body[1]).to.have.property("role", "COURIER");
    });

    it("debe rechazar una cantidad superior al máximo", async function () {
      const response = await request(app).get("/api/mocks/couriers?qty=51");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "INVALID_MOCK_QUANTITY"
      );
    });
  });

  describe("GET /api/mocks/dataset", function () {
    it("debe generar un dataset con entidades relacionadas", async function () {
      const response = await request(app).get("/api/mocks/dataset?qty=3");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("users").that.is.an("array");
      expect(response.body).to.have.property("couriers").that.is.an("array");
      expect(response.body).to.have.property("products").that.is.an("array");
      expect(response.body).to.have.property("orders").that.is.an("array");
      expect(response.body).to.have.property("deliveries").that.is.an("array");

      expect(response.body.users).to.have.lengthOf(3);
      expect(response.body.orders).to.have.lengthOf(3);
      expect(response.body.deliveries).to.have.lengthOf(3);
    });

    it("debe rechazar una cantidad no entera", async function () {
      const response = await request(app).get("/api/mocks/dataset?qty=2.5");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "INVALID_MOCK_QUANTITY"
      );
    });
  });

  describe("POST /api/mocks/seed", function () {
    it("debe insertar los datos relacionados en MongoDB", async function () {
      const response = await request(app)
        .post("/api/mocks/seed?qty=2");

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property(
        "message",
        "Datos de prueba insertados correctamente."
      );

      expect(response.body).to.have.property("inserted");
      expect(response.body.inserted).to.have.property("users", 3);
      expect(response.body.inserted).to.have.property("couriers",1);
      expect(response.body.inserted).to.have.property("products", 2);
      expect(response.body.inserted).to.have.property("orders", 2);
      expect(response.body.inserted).to.have.property("deliveries", 2);

      expect(response.body).to.have.property("ids");
      expect(response.body.ids.users).to.have.lengthOf(3);

      expect(await User.countDocuments()).to.equal(3);
      expect(await Product.countDocuments()).to.equal(2);
      expect(await Order.countDocuments()).to.equal(2);
      expect(await Delivery.countDocuments()).to.equal(2);
    });

    it("debe rechazar una cantidad inválida", async function () {
      const response = await request(app)
        .post("/api/mocks/seed")
        .send({ qty: 0 });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "INVALID_MOCK_QUANTITY"
      );
    });
  });
});
