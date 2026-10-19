const userRepository = require("../repositories/user.repository");
const { USER_ROLES } = require("../constants");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateId(id) {
  const isValid = typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

  if (!isValid) {
    throw createError("El ID del usuario no es válido.", 400);
  }
}

function normalizeUserData(data, isUpdate = false) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Los datos del usuario no son válidos.", 400);
  }

  const userData = {};

  if (!isUpdate || Object.hasOwn(data, "name")) {
    const name = typeof data.name === "string" ? data.name.trim() : "";

    if (!name) {
      throw createError("El nombre del usuario es obligatorio.", 400);
    }

    userData.name = name;
  }

  if (!isUpdate || Object.hasOwn(data, "email")) {
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      throw createError("El correo electrónico es obligatorio.", 400);
    }

    if (!emailRegex.test(email)) {
      throw createError("El correo electrónico no es válido.", 400);
    }

    userData.email = email;
  }

  if (Object.hasOwn(data, "role")) {
    if (!Object.values(USER_ROLES).includes(data.role)) {
      throw createError("El rol del usuario no es válido.", 400);
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
      throw createError("Usuario no encontrado.", 404);
    }

    return user;
  }

  async create(data) {
    const userData = normalizeUserData(data);

    const existingUser = await userRepository.getByEmail(userData.email);

    if (existingUser) {
      throw createError(
        "Ya existe un usuario con ese correo electrónico.",
        409
      );
    }

    try {
      return await userRepository.create(userData);
    } catch (error) {
      if (error.code === 11000) {
        throw createError(
          "Ya existe un usuario con ese correo electrónico.",
          409
        );
      }

      throw error;
    }
  }

  async update(id, data) {
    validateId(id);

    const existingUser = await userRepository.getById(id);

    if (!existingUser) {
      throw createError("Usuario no encontrado.", 404);
    }

    const userData = normalizeUserData(data, true);

    if (Object.keys(userData).length === 0) {
      throw createError(
        "Debes proporcionar al menos un campo para actualizar.",
        400
      );
    }

    if (userData.email) {
      const userWithEmail = await userRepository.getByEmail(userData.email);

      if (
        userWithEmail &&
        userWithEmail._id.toString() !== existingUser._id.toString()
      ) {
        throw createError(
          "Ya existe un usuario con ese correo electrónico.",
          409
        );
      }
    }

    try {
      const updatedUser = await userRepository.update(id, userData);

      if (!updatedUser) {
        throw createError("Usuario no encontrado.", 404);
      }

      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw createError(
          "Ya existe un usuario con ese correo electrónico.",
          409
        );
      }

      throw error;
    }
  }

  async delete(id) {
    validateId(id);

    const deletedUser = await userRepository.delete(id);

    if (!deletedUser) {
      throw createError("Usuario no encontrado.", 404);
    }

    return deletedUser;
  }
}

module.exports = new UserService();
