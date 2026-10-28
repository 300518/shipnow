const { faker } = require("@faker-js/faker");

const {
  USER_ROLES,
  PRODUCT_STATUS,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
} = require("../constants");

function createMockUser(role = USER_ROLES.CUSTOMER) {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role,
  };
}

function createMockProduct() {
  const stock = faker.number.int({ min: 0, max: 100 });

  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 1000, max: 100000 })),
    stock,
    status: stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK,
  };
}

function createMockOrder(customerId, products = []) {
  const product = products.length ? faker.helpers.arrayElement(products) : null;

  const items = product
    ? [
        {
          product: product._id,
          quantity: faker.number.int({ min: 1, max: 3 }),
          unitPrice: product.price,
        },
      ]
    : [];

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const status = faker.helpers.arrayElement([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PREPARING,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
  ]);

  return {
    _id: faker.database.mongodbObjectId(),
    customer: customerId,
    items,
    total,
    shippingAddress: faker.location.streetAddress(),
    status,
    priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
  };
}

function createMockDelivery(orderId, courierId = null, orderStatus) {
  let status;

  if (orderStatus === ORDER_STATUS.DELIVERED) {
    status = DELIVERY_STATUS.DELIVERED;
  } else if (orderStatus === ORDER_STATUS.SHIPPED) {
    status = courierId ? DELIVERY_STATUS.IN_TRANSIT : DELIVERY_STATUS.PENDING;
  } else if (courierId) {
    status = DELIVERY_STATUS.ASSIGNED;
  } else {
    status = DELIVERY_STATUS.PENDING;
  }

  return {
    _id: faker.database.mongodbObjectId(),
    order: orderId,
    courier: courierId,
    status,
    estimatedDelivery: faker.date.soon({ days: 5 }),
    deliveredAt: status === DELIVERY_STATUS.DELIVERED ? new Date() : null,
  };
}

function createMockDataset(qty = 5) {
  const customers = Array.from({ length: qty }, () =>
    createMockUser(USER_ROLES.CUSTOMER)
  );

  const couriers = Array.from({ length: Math.max(1, Math.ceil(qty / 3)) }, () =>
    createMockUser(USER_ROLES.COURIER)
  );

  const products = Array.from({ length: Math.max(1, qty) }, () =>
    createMockProduct()
  );

  const orders = customers.map((customer) =>
    createMockOrder(customer._id, products)
  );

  const deliveries = orders.map((order, index) => {
    const requiresCourier = [
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
    ].includes(order.status);

    const shouldAssignCourier =
      order.status !== ORDER_STATUS.CANCELLED &&
      (requiresCourier || index % 2 === 0);

    const courierId = shouldAssignCourier
      ? couriers[index % couriers.length]._id
      : null;

    return createMockDelivery(order._id, courierId, order.status);
  });

  return {
    users: customers,
    couriers,
    products,
    orders,
    deliveries,
  };
}

module.exports = {
  createMockUser,
  createMockProduct,
  createMockOrder,
  createMockDelivery,
  createMockDataset,
};
