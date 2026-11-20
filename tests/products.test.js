
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/product.model");

describe("Pruebas funcionales - Productos", function () {
  describe("GET /api/products", function () {
    it("debe listar productos con stock disponible", async function () {
      await Product.create({
        name: "Producto disponible",
        price: 15000,
        stock: 10,
      });

      await Product.create({
        name: "Producto sin stock",
        price: 10000,
        stock: 0,
      });

      const response = await request(app).get("/api/products");

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an("array");
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.data[0]).to.have.property(
        "name",
        "Producto disponible"
      );
      expect(response.body.data[0]).to.have.property("stock", 10);
    });
  });

  describe("GET /api/products/:id", function () {
    it("debe obtener un producto existente", async function () {
      const product = await Product.create({
        name: "Teclado mecánico",
        price: 45000,
        stock: 5,
      });

      const response = await request(app).get(
        `/api/products/${product._id}`
      );

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property(
        "name",
        "Teclado mecánico"
      );
      expect(response.body.data).to.have.property("price", 45000);
      expect(response.body.data).to.have.property("_id");
    });

    it("debe devolver error cuando el producto no existe", async function () {
      const id = "507f1f77bcf86cd799439021";

      const response = await request(app).get(`/api/products/${id}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "PRODUCT_NOT_FOUND"
      );
      expect(response.body.error).to.have.property("mensaje").that.is.a("string");
    });

    it("debe rechazar un ID inválido", async function () {
      const response = await request(app).get("/api/products/id-invalido");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo");
    });
  });

  describe("POST /api/products", function () {
    it("debe crear un producto correctamente", async function () {
      const response = await request(app)
        .post("/api/products")
        .send({
          name: "Mouse inalámbrico",
          description: "Mouse de prueba",
          price: 25000,
          stock: 8,
        });

      expect(response.status).to.equal(201);
      expect(response.body.data).to.include({
        name: "Mouse inalámbrico",
        description: "Mouse de prueba",
        price: 25000,
        stock: 8,
        status: "AVAILABLE",
      });
      expect(response.body.data).to.have.property("_id");
    });

    it("debe rechazar un producto sin nombre", async function () {
      const response = await request(app)
        .post("/api/products")
        .send({
          price: 10000,
          stock: 5,
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar un precio negativo", async function () {
      const response = await request(app)
        .post("/api/products")
        .send({
          name: "Producto inválido",
          price: -100,
          stock: 5,
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar un stock negativo", async function () {
      const response = await request(app)
        .post("/api/products")
        .send({
          name: "Producto sin stock válido",
          price: 10000,
          stock: -1,
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });
  });
});
