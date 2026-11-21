const mongoose = require("mongoose");
const { DELIVERY_STATUS } = require("../constants");

const proofSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    documentType: {
      type: String,
      default: "DELIVERY_PROOF",
    },
  },
  { _id: true }
);

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    courier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(DELIVERY_STATUS),
      default: DELIVERY_STATUS.PENDING,
    },
    estimatedDelivery: {
      type: Date,
      required: true,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    proof: {
      type: proofSchema,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Delivery", deliverySchema);
