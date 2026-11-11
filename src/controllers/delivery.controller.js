const deliveryService = require("../services/delivery.service");

class DeliveryController {
  async getAll(req, res, next) {
    try {
      const deliveries = await deliveryService.getAll();
      return res.status(200).json({ data: deliveries });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const delivery = await deliveryService.getById(req.params.id);
      return res.status(200).json({ data: delivery });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const delivery = await deliveryService.create(req.body);
      return res.status(201).json({ data: delivery });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new DeliveryController();
