const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Delivery = require("../models/delivery.model");

class MockRepository {
  async seed(dataset) {
    const insertedIds = {
      users: [],
      products: [],
      orders: [],
      deliveries: [],
    };

    const users = [...dataset.users, ...dataset.couriers];

    try {
      // 1. Insertar clientes y repartidores.
      const insertedUsers = await User.insertMany(users);
      insertedIds.users = insertedUsers.map((user) => user._id);

      // 2. Insertar productos.
      const insertedProducts = await Product.insertMany(dataset.products);
      insertedIds.products = insertedProducts.map((product) => product._id);

      // 3. Insertar pedidos asociados a clientes y productos.
      const insertedOrders = await Order.insertMany(dataset.orders);
      insertedIds.orders = insertedOrders.map((order) => order._id);

      // 4. Insertar entregas asociadas a pedidos.
      const insertedDeliveries = await Delivery.insertMany(dataset.deliveries);
      insertedIds.deliveries = insertedDeliveries.map(
        (delivery) => delivery._id
      );

      return {
        inserted: {
          users: insertedUsers.length,
          couriers: dataset.couriers.length,
          products: insertedProducts.length,
          orders: insertedOrders.length,
          deliveries: insertedDeliveries.length,
        },
        ids: insertedIds,
      };
    } catch (error) {
      // Intentar revertir las inserciones de este lote.
      await Promise.allSettled([
        Delivery.deleteMany({ _id: { $in: insertedIds.deliveries } }),
        Order.deleteMany({ _id: { $in: insertedIds.orders } }),
        Product.deleteMany({ _id: { $in: insertedIds.products } }),
        User.deleteMany({ _id: { $in: insertedIds.users } }),
      ]);

      throw error;
    }
  }
}

module.exports = new MockRepository();
