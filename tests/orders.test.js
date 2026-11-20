
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");

describe("Pruebas funcionales - Pedidos", function () {
  let customer;
  let product;

  beforeEach(async function () {
    customer = await User.create({
      name: "Cliente de pedidos",
      email: `cliente.${Date.now()}@test.com`,
      role: "CUSTOMER",
    });

    product = await Product.create({
      name: "Producto para pedido",
      price: 10000,
      stock: 20,
    });
  });

  describe("GET /api/orders", function () {
    it("debe listar pedidos y devolver sus relaciones", async function () {
      await Order.create({
        customer: customer._id,
        items: [
          {
            product: product._id,
            quantity: 2,
            unitPrice: product.price,
          },
        ],
        total: 20000,
        shippingAddress: "Av. Providencia 123",
      });

      const response = await request(app).get("/api/orders");

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an("array").with.lengthOf(1);

      const order = response.body.data[0];

      expect(order.customer).to.have.property("name", "Cliente de pedidos");
      expect(order.items[0].product).to.have.property(
        "name",
        "Producto para pedido"
      );
      expect(order).to.have.property("total", 20000);
    });
  });

  describe("GET /api/orders/:id", function () {
    it("debe obtener un pedido existente", async function () {
      const order = await Order.create({
        customer: customer._id,
        items: [
          {
            product: product._id,
            quantity: 1,
            unitPrice: product.price,
          },
        ],
        total: product.price,
        shippingAddress: "Av. Apoquindo 100",
      });

      const response = await request(app).get(`/api/orders/${order._id}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property("_id", order._id.toString());
      expect(response.body.data.customer).to.have.property(
        "email",
        customer.email
      );
      expect(response.body.data.items[0].product).to.have.property(
        "name",
        product.name
      );
    });

    it("debe devolver error cuando el pedido no existe", async function () {
      const id = "507f1f77bcf86cd799439031";

      const response = await request(app).get(`/api/orders/${id}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "ORDER_NOT_FOUND");
      expect(response.body.error).to.have.property("mensaje").that.is.a("string");
    });

    it("debe rechazar un ID inválido", async function () {
      const response = await request(app).get("/api/orders/id-invalido");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });
  });

  describe("POST /api/orders", function () {
    it("debe crear un pedido y calcular el total con el precio real", async function () {
      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: customer._id.toString(),
          items: [
            {
              product: product._id.toString(),
              quantity: 3,
              unitPrice: 1,
            },
          ],
          shippingAddress: "Av. Las Condes 456",
        });

      expect(response.status).to.equal(201);

      const createdOrder = response.body.data;

      expect(createdOrder).to.have.property("_id");
      expect(createdOrder).to.have.property("total", 30000);
      expect(createdOrder).to.have.property("status", "PENDING");
      expect(createdOrder.customer).to.have.property(
        "email",
        customer.email
      );
      expect(createdOrder.items[0].product).to.have.property(
        "name",
        product.name
      );
      expect(createdOrder.items[0]).to.have.property("unitPrice", 10000);
      expect(createdOrder.items[0]).to.have.property("quantity", 3);
    });

    it("debe rechazar un pedido sin cliente", async function () {
      const response = await request(app)
        .post("/api/orders")
        .send({
          items: [
            {
              product: product._id.toString(),
              quantity: 1,
            },
          ],
          shippingAddress: "Av. Providencia 123",
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar un pedido sin productos", async function () {
      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: customer._id.toString(),
          items: [],
          shippingAddress: "Av. Providencia 123",
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar una cantidad menor que uno", async function () {
      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: customer._id.toString(),
          items: [
            {
              product: product._id.toString(),
              quantity: 0,
            },
          ],
          shippingAddress: "Av. Providencia 123",
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar un producto inexistente", async function () {
      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: customer._id.toString(),
          items: [
            {
              product: "507f1f77bcf86cd799439032",
              quantity: 1,
            },
          ],
          shippingAddress: "Av. Providencia 123",
        });

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "PRODUCT_NOT_FOUND"
      );
    });

    it("debe rechazar un cliente inexistente", async function () {
      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: "507f1f77bcf86cd799439033",
          items: [
            {
              product: product._id.toString(),
              quantity: 1,
            },
          ],
          shippingAddress: "Av. Providencia 123",
        });

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "USER_NOT_FOUND");
    });
  });
});
