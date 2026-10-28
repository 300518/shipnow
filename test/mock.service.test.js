const { test } = require('node:test');
const assert = require('node:assert/strict');

const mockService = require('../src/services/mock.service');
const { USER_ROLES } = require('../src/constants');

test('generateUsers genera la cantidad solicitada', () => {
  const users = mockService.generateUsers(4);

  assert.equal(users.length, 4);
  assert.ok(
    users.every((user) =>
      [USER_ROLES.CUSTOMER, USER_ROLES.COURIER].includes(user.role)
    )
  );
});

test('generateCouriers genera solo repartidores', () => {
  const couriers = mockService.generateCouriers(3);

  assert.equal(couriers.length, 3);
  assert.ok(
    couriers.every((courier) => courier.role === USER_ROLES.COURIER)
  );
});

test('generateDataset crea registros relacionados', () => {
  const dataset = mockService.generateDataset(3);

  assert.equal(dataset.users.length, 3);
  assert.equal(dataset.orders.length, 3);
  assert.equal(dataset.deliveries.length, 3);
  assert.ok(dataset.products.length >= 1);
  assert.ok(dataset.couriers.length >= 1);

  const customerIds = new Set(
    dataset.users.map((user) => user._id)
  );
  const productIds = new Set(
    dataset.products.map((product) => product._id)
  );
  const orderIds = new Set(
    dataset.orders.map((order) => order._id)
  );

  for (const order of dataset.orders) {
    assert.ok(customerIds.has(order.customer));
    assert.ok(order.items.length > 0);

    for (const item of order.items) {
      assert.ok(productIds.has(item.product));
      assert.ok(item.quantity >= 1);
    }
  }

  for (const delivery of dataset.deliveries) {
    assert.ok(orderIds.has(delivery.order));
  }
});

test('generateDataset rechaza cantidades inválidas', () => {
  for (const qty of [0, -1, 1.5, 51, 'abc']) {
    assert.throws(
      () => mockService.generateDataset(qty),
      (error) => {
        assert.equal(error.statusCode, 400);
        return true;
      }
    );
  }
});
