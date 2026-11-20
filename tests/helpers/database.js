
const mongoose = require("mongoose");

const User = require("../../src/models/user.model");
const Product = require("../../src/models/product.model");
const Order = require("../../src/models/order.model");
const Delivery = require("../../src/models/delivery.model");

const models = [User, Product, Order, Delivery];

async function connectDatabase() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Conexión denegada: el entorno no es de pruebas.");
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.includes("shipnow_testing")) {
    throw new Error(
      "Conexión denegada: la URI debe apuntar a shipnow_testing."
    );
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

async function clearDatabase() {
  if (
    process.env.NODE_ENV !== "test" ||
    mongoose.connection.name !== "shipnow_testing"
  ) {
    throw new Error(
      "Limpieza denegada: la conexión no corresponde a la base de pruebas."
    );
  }

  await Promise.all(models.map((model) => model.deleteMany({})));
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDatabase,
  clearDatabase,
  disconnectDatabase,
};
