const Order = require("../models/order.model");

class OrderRepository {
  async getAll() {
    return Order.find({})
      .populate("customer", "name email role")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getById(id) {
    return Order.findById(id)
      .populate("customer", "name email role")
      .populate("items.product", "name price")
      .lean();
  }

  async create(orderData) {
    const order = await Order.create(orderData);

    return Order.findById(order._id)
      .populate("customer", "name email role")
      .populate("items.product", "name price")
      .lean();
  }
}

module.exports = new OrderRepository();
