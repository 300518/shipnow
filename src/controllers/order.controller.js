const orderService = require("../services/order.service");

class OrderController {
  async getAll(req, res, next) {
    try {
      const orders = await orderService.getAll();
      return res.status(200).json({ data: orders });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id);
      return res.status(200).json({ data: order });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await orderService.create(req.body);
      return res.status(201).json({ data: order });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new OrderController();
