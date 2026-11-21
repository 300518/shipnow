const Delivery = require("../models/delivery.model");

class DeliveryRepository {
  async getAll() {
    return Delivery.find({})
      .populate("order")
      .populate("courier", "name email role")
      .sort({ createdAt: -1 })
      .lean();
  }

  async getById(id) {
    return Delivery.findById(id)
      .populate("order")
      .populate("courier", "name email role")
      .lean();
  }

  async create(deliveryData) {
    const delivery = await Delivery.create(deliveryData);

    return Delivery.findById(delivery._id)
      .populate("order")
      .populate("courier", "name email role")
      .lean();
  }
  async updateProof(id, proofData) {
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      { proof: proofData },
      {
        returnDocument: "after",
        runValidators: true,
      }
    )
      .populate("order")
      .populate("courier", "name email role")
      .lean();

    return delivery;
  }
}

module.exports = new DeliveryRepository();
