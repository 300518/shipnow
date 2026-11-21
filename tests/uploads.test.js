const { expect } = require("chai");
const request = require("supertest");
const fs = require("fs/promises");
const path = require("path");

const app = require("../src/app");
const User = require("../src/models/user.model");

const uploadedFiles = [];

const validPdf = Buffer.from("%PDF-1.4\n% ShipNow test document\n", "utf8");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");

describe("Pruebas funcionales - Carga de documentos", function () {
  afterEach(async function () {
    await Promise.all(
      uploadedFiles
        .splice(0)
        .map((filePath) => fs.unlink(filePath).catch(() => {}))
    );
  });

  describe("POST /api/users/:id/documents", function () {
    it("debe cargar correctamente un documento de usuario", async function () {
      const user = await User.create({
        name: "Usuario con documento",
        email: "documento@test.com",
      });

      const response = await request(app)
        .post(`/api/users/${user._id}/documents`)
        .field("documentType", "IDENTITY")
        .attach("file", validPdf, {
          filename: "identidad.pdf",
          contentType: "application/pdf",
        });

      expect(response.status).to.equal(200);
      expect(response.body.data.documents).to.have.lengthOf(1);

      const document = response.body.data.documents[0];

      expect(document).to.include({
        originalName: "identidad.pdf",
        mimetype: "application/pdf",
        documentType: "IDENTITY",
      });

      uploadedFiles.push(path.resolve(document.path));

      const updatedUser = await User.findById(user._id);

      expect(updatedUser.documents).to.have.lengthOf(1);
    });

    it("debe rechazar una carga sin archivo", async function () {
      const user = await User.create({
        name: "Usuario sin archivo",
        email: "sinarchivo@test.com",
      });

      const response = await request(app)
        .post(`/api/users/${user._id}/documents`)
        .field("documentType", "IDENTITY");

      expect(response.status).to.equal(400);
      expect(response.body.exito).to.equal(false);
      expect(response.body.error.codigo).to.equal("INVALID_DATA");
    });

    it("debe rechazar un tipo de documento inválido", async function () {
      const user = await User.create({
        name: "Usuario tipo inválido",
        email: "tipoinvalido@test.com",
      });

      const response = await request(app)
        .post(`/api/users/${user._id}/documents`)
        .field("documentType", "INVALID")
        .attach("file", validPdf, {
          filename: "documento.pdf",
          contentType: "application/pdf",
        });

      expect(response.status).to.equal(400);
      expect(response.body.exito).to.equal(false);
      expect(response.body.error.codigo).to.equal("INVALID_DATA");
    });

    it("debe rechazar un archivo cuyo contenido no corresponde al MIME declarado", async function () {
      const user = await User.create({
        name: "Usuario archivo falso",
        email: "archivofalso@test.com",
      });

      const response = await request(app)
        .post(`/api/users/${user._id}/documents`)
        .field("documentType", "IDENTITY")
        .attach("file", Buffer.from("Esto no es un PDF"), {
          filename: "falso.pdf",
          contentType: "application/pdf",
        });

      expect(response.status).to.equal(400);
      expect(response.body.exito).to.equal(false);
      expect(response.body.error.codigo).to.equal("INVALID_DATA");
    });
  });

  describe("POST /api/deliveries/:id/proof", function () {
    let delivery;

    beforeEach(async function () {
      const customer = await User.create({
        name: "Cliente de entrega",
        email: `cliente.${Date.now()}@test.com`,
        role: "CUSTOMER",
      });

      const product = await Product.create({
        name: "Producto de entrega",
        price: 15000,
        stock: 5,
      });

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
        shippingAddress: "Av. Providencia 123",
      });

      delivery = await Delivery.create({
        order: order._id,
        estimatedDelivery: new Date("2026-12-01T15:00:00.000Z"),
      });
    });

    it("debe cargar correctamente un comprobante de entrega", async function () {
      const response = await request(app)
        .post(`/api/deliveries/${delivery._id}/proof`)
        .attach("file", validPdf, {
          filename: "comprobante.pdf",
          contentType: "application/pdf",
        });

      expect(response.status).to.equal(200);

      expect(response.body.data.proof).to.include({
        originalName: "comprobante.pdf",
        mimetype: "application/pdf",
        documentType: "DELIVERY_PROOF",
      });

      uploadedFiles.push(path.resolve(response.body.data.proof.path));

      const updatedDelivery = await Delivery.findById(delivery._id);

      expect(updatedDelivery.proof).to.exist;
      expect(updatedDelivery.proof.filename).to.equal(
        response.body.data.proof.filename
      );
    });

    it("debe rechazar un comprobante sin archivo", async function () {
      const response = await request(app).post(
        `/api/deliveries/${delivery._id}/proof`
      );

      expect(response.status).to.equal(400);
      expect(response.body.exito).to.equal(false);
      expect(response.body.error.codigo).to.equal("INVALID_DATA");
    });

    it("debe rechazar una entrega inexistente", async function () {
      const id = "507f1f77bcf86cd799439099";

      const response = await request(app)
        .post(`/api/deliveries/${id}/proof`)
        .attach("file", validPdf, {
          filename: "comprobante.pdf",
          contentType: "application/pdf",
        });

      expect(response.status).to.equal(404);
      expect(response.body.exito).to.equal(false);
      expect(response.body.error.codigo).to.equal("DELIVERY_NOT_FOUND");
    });
  });
});
