const userService = require("../services/user.service");

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      return res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      return res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      return res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const user = await userService.delete(req.params.id);
      return res.status(200).json({
        message: "Usuario eliminado correctamente.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
