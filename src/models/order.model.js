const mongoose = require("mongoose");
const { ORDER_STATUS, ORDER_PRIORITY } = require("../constants");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(ORDER_PRIORITY),
      default: ORDER_PRIORITY.NORMAL,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", orderSchema);
