const { test } = require('node:test');
const assert = require('node:assert/strict');

const productService = require('../src/services/product.service');
const productRepository = require('../src/repositories/product.repository');

test('getAll devuelve solo productos con stock mayor que cero', async () => {
  const originalGetAll = productRepository.getAll;

  productRepository.getAll = async () => [
    { _id: '1', name: 'Teclado', stock: 5 },
    { _id: '2', name: 'Mouse', stock: 0 },
    { _id: '3', name: 'Monitor', stock: 12 },
  ];

  try {
    const products = await productService.getAll();

    assert.deepEqual(
      products.map((product) => product.name),
      ['Teclado', 'Monitor']
    );
    assert.ok(products.every((product) => product.stock > 0));
  } finally {
    productRepository.getAll = originalGetAll;
  }
});

test('getById devuelve error 404 si el producto no existe', async () => {
  const originalGetById = productRepository.getById;

  productRepository.getById = async () => null;

  try {
    await assert.rejects(
      productService.getById('id-inexistente'),
      (error) => {
        assert.equal(error.statusCode, 404);
        assert.equal(error.message, 'Producto no encontrado.');
        return true;
      }
    );
  } finally {
    productRepository.getById = originalGetById;
  }
});

test('create rechaza productos sin nombre', async () => {
  await assert.rejects(
    productService.create({
      name: '   ',
      price: 1000,
      stock: 5,
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(
        error.message,
        'El nombre del producto es obligatorio.'
      );
      return true;
    }
  );
});

test('create rechaza precios negativos', async () => {
  await assert.rejects(
    productService.create({
      name: 'Teclado',
      price: -100,
      stock: 5,
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(
        error.message,
        'El precio debe ser un número mayor o igual a cero.'
      );
      return true;
    }
  );
});
