const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");

describe("Pruebas funcionales - Entregas", function () {
  let customer;
  let courier;
  let product;
  let order;

  async function createOrder() {
    return Order.create({
      customer: customer._id,
      items: [
        {
          product: product._id,
          quantity: 1,
          unitPrice: product.price,
        },
      ],
      total: product.price,
      shippingAddress: "Av. Providencia 123",
    });
  }

  beforeEach(async function () {
    customer = await User.create({
      name: "Cliente de entregas",
      email: `cliente.entrega.${Date.now()}@test.com`,
      role: "CUSTOMER",
    });

    courier = await User.create({
      name: "Repartidor de pruebas",
      email: `repartidor.${Date.now()}@test.com`,
      role: "COURIER",
    });

    product = await Product.create({
      name: "Producto para entrega",
      price: 10000,
      stock: 20,
    });

    order = await createOrder();
  });

  describe("GET /api/deliveries", function () {
    it("debe listar entregas y devolver sus relaciones", async function () {
      await Delivery.create({
        order: order._id,
        courier: courier._id,
        estimatedDelivery: new Date("2026-12-01T12:00:00"),
      });

      const response = await request(app).get("/api/deliveries");

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an("array").with.lengthOf(1);

      const delivery = response.body.data[0];

      expect(delivery.order).to.have.property("_id");
      expect(delivery.order.customer.toString()).to.equal(
        customer._id.toString()
      );
      expect(delivery.courier).to.have.property(
        "name",
        "Repartidor de pruebas"
      );
      expect(delivery).to.have.property("status", "PENDING");
    });

    it("debe devolver los metadatos de paginación por defecto", async function () {
      await Delivery.create({
        order: order._id,
        estimatedDelivery: new Date("2026-12-01T12:00:00"),
      });

      const response = await request(app).get("/api/deliveries");

      expect(response.status).to.equal(200);
      expect(response.body.pagination).to.deep.equal({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it("debe respetar los parámetros page y limit", async function () {
      await Delivery.create({
        order: order._id,
        estimatedDelivery: new Date("2026-12-01T12:00:00"),
      });

      const secondOrder = await createOrder();
      await Delivery.create({
        order: secondOrder._id,
        estimatedDelivery: new Date("2026-12-02T12:00:00"),
      });

      const thirdOrder = await createOrder();
      await Delivery.create({
        order: thirdOrder._id,
        estimatedDelivery: new Date("2026-12-03T12:00:00"),
      });

      const response = await request(app).get("/api/deliveries?page=2&limit=2");

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an("array").with.lengthOf(1);
      expect(response.body.pagination).to.deep.equal({
        page: 2,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it("debe rechazar un límite superior a 50", async function () {
      const response = await request(app).get("/api/deliveries?limit=100");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });
  });

  describe("GET /api/deliveries/:id", function () {
    it("debe obtener una entrega existente", async function () {
      const delivery = await Delivery.create({
        order: order._id,
        courier: courier._id,
        estimatedDelivery: new Date("2026-12-01T12:00:00"),
      });

      const response = await request(app).get(
        `/api/deliveries/${delivery._id}`
      );

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property(
        "_id",
        delivery._id.toString()
      );
    });

    it("debe devolver error cuando la entrega no existe", async function () {
      const id = "507f1f77bcf86cd799439031";

      const response = await request(app).get(`/api/deliveries/${id}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "DELIVERY_NOT_FOUND"
      );
    });

    it("debe rechazar un ID inválido", async function () {
      const response = await request(app).get("/api/deliveries/id-invalido");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });
  });

  describe("POST /api/deliveries", function () {
    it("debe crear una entrega correctamente", async function () {
      const response = await request(app).post("/api/deliveries").send({
        order: order._id.toString(),
        courier: courier._id.toString(),
        estimatedDelivery: "2026-12-01T12:00:00",
      });

      expect(response.status).to.equal(201);
      expect(response.body.data).to.have.property("_id");
      expect(response.body.data).to.have.property("status", "PENDING");
    });

    it("debe rechazar una entrega sin pedido", async function () {
      const response = await request(app).post("/api/deliveries").send({
        estimatedDelivery: "2026-12-01T12:00:00",
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar una fecha estimada inválida", async function () {
      const response = await request(app).post("/api/deliveries").send({
        order: order._id.toString(),
        estimatedDelivery: "fecha-invalida",
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar un pedido inexistente", async function () {
      const response = await request(app).post("/api/deliveries").send({
        order: "507f1f77bcf86cd799439032",
        estimatedDelivery: "2026-12-01T12:00:00",
      });

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "ORDER_NOT_FOUND");
    });

    it("debe rechazar un usuario que no sea repartidor", async function () {
      const response = await request(app).post("/api/deliveries").send({
        order: order._id.toString(),
        courier: customer._id.toString(),
        estimatedDelivery: "2026-12-01T12:00:00",
      });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar una entrega duplicada para el mismo pedido", async function () {
      await Delivery.create({
        order: order._id,
        estimatedDelivery: new Date("2026-12-01T12:00:00"),
      });

      const response = await request(app).post("/api/deliveries").send({
        order: order._id.toString(),
        estimatedDelivery: "2026-12-02T12:00:00",
      });

      expect(response.status).to.equal(409);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "RESOURCE_ALREADY_EXISTS"
      );
    });
  });
});
