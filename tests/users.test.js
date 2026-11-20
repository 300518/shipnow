
const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

const User = require("../src/models/user.model");

describe("Pruebas funcionales - Usuarios", function () {
  describe("GET /api/users", function () {
    it("debe listar usuarios y devolver un arreglo", async function () {
      await User.create({
        name: "Usuario de prueba",
        email: "usuario.listado@test.com",
      });

      const response = await request(app).get("/api/users");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("data").that.is.an("array");
      expect(response.body.data).to.have.lengthOf(1);
      expect(response.body.data[0]).to.have.property("name");
      expect(response.body.data[0]).to.have.property("email");
      expect(response.body.data[0]).to.have.property("role");
    });
  });

  describe("GET /api/users/:id", function () {
    it("debe obtener un usuario existente", async function () {
      const user = await User.create({
        name: "Usuario individual",
        email: "usuario.individual@test.com",
      });

      const response = await request(app).get(`/api/users/${user._id}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.include({
        name: "Usuario individual",
        email: "usuario.individual@test.com",
      });
      expect(response.body.data).to.have.property("_id");
    });

    it("debe devolver error al buscar un ID inexistente", async function () {
      const id = "507f1f77bcf86cd799439011";

      const response = await request(app).get(`/api/users/${id}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "USER_NOT_FOUND"
      );
      expect(response.body.error).to.have.property("mensaje").that.is.a("string");
    });

    it("debe rechazar un ID inválido", async function () {
      const response = await request(app).get("/api/users/id-invalido");

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });
  });

  describe("POST /api/users", function () {
    it("debe crear un usuario correctamente", async function () {
      const response = await request(app)
        .post("/api/users")
        .send({
          name: "Usuario nuevo",
          email: "usuario.nuevo@test.com",
        });

      expect(response.status).to.equal(201);
      expect(response.body.data).to.include({
        name: "Usuario nuevo",
        email: "usuario.nuevo@test.com",
        role: "USER",
      });
      expect(response.body.data).to.have.property("_id");
    });

    it("debe rechazar la creación sin nombre", async function () {
      const response = await request(app)
        .post("/api/users")
        .send({
          email: "sin.nombre@test.com",
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });

    it("debe rechazar un correo duplicado", async function () {
      await User.create({
        name: "Usuario existente",
        email: "duplicado@test.com",
      });

      const response = await request(app)
        .post("/api/users")
        .send({
          name: "Usuario duplicado",
          email: "duplicado@test.com",
        });

      expect(response.status).to.equal(409);
      expect(response.body.error).to.have.property(
        "codigo",
        "RESOURCE_ALREADY_EXISTS"
      );
    });
  });

  describe("PATCH /api/users/:id", function () {
    it("debe actualizar un usuario", async function () {
      const user = await User.create({
        name: "Nombre anterior",
        email: "actualizar@test.com",
      });

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .send({ name: "Nombre actualizado" });

      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property(
        "name",
        "Nombre actualizado"
      );
      expect(response.body.data).to.have.property(
        "email",
        "actualizar@test.com"
      );
    });

    it("debe rechazar una actualización vacía", async function () {
      const user = await User.create({
        name: "Usuario sin cambios",
        email: "sin.cambios@test.com",
      });

      const response = await request(app)
        .patch(`/api/users/${user._id}`)
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property("codigo", "INVALID_DATA");
    });
  });

  describe("DELETE /api/users/:id", function () {
    it("debe eliminar un usuario existente", async function () {
      const user = await User.create({
        name: "Usuario para eliminar",
        email: "eliminar@test.com",
      });

      const response = await request(app).delete(`/api/users/${user._id}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property(
        "message",
        "Usuario eliminado correctamente."
      );
      expect(response.body.data).to.have.property("_id");

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).to.equal(null);
    });

    it("debe devolver error al eliminar un usuario inexistente", async function () {
      const id = "507f1f77bcf86cd799439012";

      const response = await request(app).delete(`/api/users/${id}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("exito", false);
      expect(response.body.error).to.have.property(
        "codigo",
        "USER_NOT_FOUND"
      );
    });
  });
});
