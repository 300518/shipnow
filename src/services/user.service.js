const userRepository = require("../repositories/user.repository");
const { USER_ROLES } = require("../constants");
const {
  DatosInvalidosError,
  UsuarioNoEncontradoError,
  RecursoDuplicadoError,
} = require("../errors");
const logger = require("../config/logger.config");

function validateId(id) {
  const isValid = typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

  if (!isValid) {
    throw new DatosInvalidosError({
      parametro: "id",
      valor: id,
    });
  }
}

function normalizeUserData(data, isUpdate = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new DatosInvalidosError();
  }

  const userData = {};

  if (!isUpdate || Object.hasOwn(data, "name")) {
    const name = typeof data.name === "string" ? data.name.trim() : "";

    if (!name) {
      throw new DatosInvalidosError({
        parametro: "name",
        mensaje: "El nombre del usuario es obligatorio.",
      });
    }

    userData.name = name;
  }

  if (!isUpdate || Object.hasOwn(data, "email")) {
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      throw new DatosInvalidosError({
        parametro: "email",
        mensaje: "El correo electrónico es obligatorio.",
      });
    }

    if (!emailRegex.test(email)) {
      throw new DatosInvalidosError({
        parametro: "email",
        mensaje: "El correo electrónico no es válido.",
      });
    }

    userData.email = email;
  }

  if (Object.hasOwn(data, "role")) {
    if (!Object.values(USER_ROLES).includes(data.role)) {
      throw new DatosInvalidosError({
        parametro: "role",
        mensaje: "El rol del usuario no es válido.",
      });
    }

    userData.role = data.role;
  } else if (!isUpdate) {
    userData.role = USER_ROLES.USER;
  }

  return userData;
}

class UserService {
  async getAll() {
    return userRepository.getAll();
  }

  async getById(id) {
    validateId(id);

    const user = await userRepository.getById(id);

    if (!user) {
      throw new UsuarioNoEncontradoError();
    }

    return user;
  }

  async create(data) {
    const userData = normalizeUserData(data);

    const existingUser = await userRepository.getByEmail(userData.email);

    if (existingUser) {
      throw new RecursoDuplicadoError({
        parametro: "email",
        valor: userData.email,
      });
    }

    try {
      const newUser = await userRepository.create(userData);

      logger.info("Usuario creado correctamente", {
        usuarioId: newUser._id.toString(),
        rol: newUser.role,
      });

      return newUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new RecursoDuplicadoError({
          parametro: "email",
          valor: userData.email,
        });
      }

      throw error;
    }
  }

  async update(id, data) {
    validateId(id);

    const existingUser = await userRepository.getById(id);

    if (!existingUser) {
      throw new UsuarioNoEncontradoError();
    }

    const userData = normalizeUserData(data, true);

    if (Object.keys(userData).length === 0) {
      throw new DatosInvalidosError({
        mensaje: "Debes proporcionar al menos un campo para actualizar.",
      });
    }

    if (userData.email) {
      const userWithEmail = await userRepository.getByEmail(userData.email);

      if (
        userWithEmail &&
        userWithEmail._id.toString() !== existingUser._id.toString()
      ) {
        throw new RecursoDuplicadoError({
          parametro: "email",
          valor: userData.email,
        });
      }
    }

    try {
      const updatedUser = await userRepository.update(id, userData);

      if (!updatedUser) {
        throw new UsuarioNoEncontradoError();
      }

      logger.info("Usuario actualizado correctamente", {
        usuarioId: updatedUser._id.toString(),
        camposActualizados: Object.keys(userData),
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new RecursoDuplicadoError({
          parametro: "email",
          valor: userData.email,
        });
      }

      throw error;
    }
  }

  async delete(id) {
    validateId(id);

    const deletedUser = await userRepository.delete(id);

    if (!deletedUser) {
      throw new UsuarioNoEncontradoError();
    }

    logger.info("Usuario eliminado correctamente", {
      usuarioId: deletedUser._id.toString(),
    });

    return deletedUser;
  }
}

module.exports = new UserService();
