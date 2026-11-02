const { test } = require("node:test");
const assert = require("node:assert/strict");

const userRepository = require("../src/repositories/user.repository");
const userService = require("../src/services/user.service");
const { USER_ROLES } = require("../src/constants");
const {
  UsuarioNoEncontradoError,
  DatosInvalidosError,
  RecursoDuplicadoError,
} = require("../src/errors");

test("getById rechaza IDs inválidos", async () => {
  await assert.rejects(() => userService.getById("123"), DatosInvalidosError);
});

test("getById devuelve error si el usuario no existe", async () => {
  const originalGetById = userRepository.getById;

  userRepository.getById = async () => null;

  try {
    await assert.rejects(
      () => userService.getById("507f1f77bcf86cd799439011"),
      UsuarioNoEncontradoError
    );
  } finally {
    userRepository.getById = originalGetById;
  }
});

test("create rechaza usuarios sin nombre", async () => {
  await assert.rejects(
    () =>
      userService.create({
        name: "",
        email: "test@shipnow.cl",
      }),
    DatosInvalidosError
  );
});

test("create rechaza correos duplicados", async () => {
  const originalGetByEmail = userRepository.getByEmail;

  userRepository.getByEmail = async () => ({
    name: "Usuario existente",
    email: "test@shipnow.cl",
  });

  try {
    await assert.rejects(
      () =>
        userService.create({
          name: "Usuario nuevo",
          email: "test@shipnow.cl",
          role: USER_ROLES.USER,
        }),
      RecursoDuplicadoError
    );
  } finally {
    userRepository.getByEmail = originalGetByEmail;
  }
});
