const { test } = require("node:test");
const assert = require("node:assert/strict");

const orderService = require("../src/services/order.service");
const orderRepository = require("../src/repositories/order.repository");
const productRepository = require("../src/repositories/product.repository");
const userRepository = require("../src/repositories/user.repository");

const CUSTOMER_ID = "507f1f77bcf86cd799439011";
const PRODUCT_ID = "507f1f77bcf86cd799439012";

test("create calcula el total utilizando el precio real del producto", async () => {
  const originalGetByIdUser = userRepository.getById;
  const originalGetByIdProduct = productRepository.getById;
  const originalCreateOrder = orderRepository.create;

  let savedOrder;

  userRepository.getById = async () => ({
    _id: CUSTOMER_ID,
    name: "Juan Pérez",
    role: "CUSTOMER",
  });

  productRepository.getById = async () => ({
    _id: PRODUCT_ID,
    name: "Teclado",
    price: 10000,
    stock: 5,
  });

  orderRepository.create = async (data) => {
    savedOrder = data;
    return { ...data, _id: "507f1f77bcf86cd799439013" };
  };

  try {
    const order = await orderService.create({
      customer: CUSTOMER_ID,
      items: [
        {
          product: PRODUCT_ID,
          quantity: 2,
          unitPrice: 1,
        },
      ],
      shippingAddress: "Av. Providencia 1234",
    });

    assert.equal(order.total, 20000);
    assert.equal(savedOrder.items[0].unitPrice, 10000);
    assert.equal(savedOrder.total, 20000);
    assert.equal(savedOrder.items[0].quantity, 2);
  } finally {
    userRepository.getById = originalGetByIdUser;
    productRepository.getById = originalGetByIdProduct;
    orderRepository.create = originalCreateOrder;
  }
});

test("create rechaza clientes inexistentes", async () => {
  const originalGetById = userRepository.getById;

  userRepository.getById = async () => null;

  try {
    await assert.rejects(
      orderService.create({
        customer: CUSTOMER_ID,
        items: [{ product: PRODUCT_ID, quantity: 1 }],
        shippingAddress: "Av. Providencia 1234",
      }),
      (error) => {
        assert.equal(error.statusCode, 404);
        return true;
      }
    );
  } finally {
    userRepository.getById = originalGetById;
  }
});

test("create rechaza productos inexistentes", async () => {
  const originalGetByIdUser = userRepository.getById;
  const originalGetByIdProduct = productRepository.getById;

  userRepository.getById = async () => ({ _id: CUSTOMER_ID });
  productRepository.getById = async () => null;

  try {
    await assert.rejects(
      orderService.create({
        customer: CUSTOMER_ID,
        items: [{ product: PRODUCT_ID, quantity: 1 }],
        shippingAddress: "Av. Providencia 1234",
      }),
      (error) => {
        assert.equal(error.statusCode, 404);
        return true;
      }
    );
  } finally {
    userRepository.getById = originalGetByIdUser;
    productRepository.getById = originalGetByIdProduct;
  }
});

test("create rechaza cantidades menores a uno", async () => {
  await assert.rejects(
    orderService.create({
      customer: CUSTOMER_ID,
      items: [{ product: PRODUCT_ID, quantity: 0 }],
      shippingAddress: "Av. Providencia 1234",
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    }
  );
});

test("create rechaza identificadores de cliente inválidos", async () => {
  await assert.rejects(
    orderService.create({
      customer: "cliente-invalido",
      items: [{ product: PRODUCT_ID, quantity: 1 }],
      shippingAddress: "Av. Providencia 1234",
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    }
  );
});
