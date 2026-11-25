const { test } = require("node:test");
const assert = require("node:assert/strict");

const productService = require("../src/services/product.service");
const productRepository = require("../src/repositories/product.repository");

test("getAll devuelve productos disponibles y su paginación", async () => {
  const originalGetAll = productRepository.getAll;

  productRepository.getAll = async ({ skip, limit }) => {
    assert.equal(skip, 0);
    assert.equal(limit, 10);

    return {
      products: [
        { _id: "1", name: "Teclado", stock: 5 },
        { _id: "3", name: "Monitor", stock: 12 },
      ],
      total: 2,
    };
  };

  try {
    const result = await productService.getAll({});

    assert.equal(result.data.length, 2);
    assert.ok(result.data.every((product) => product.stock > 0));
    assert.equal(result.pagination.page, 1);
    assert.equal(result.pagination.limit, 10);
    assert.equal(result.pagination.total, 2);
    assert.equal(result.pagination.totalPages, 1);
    assert.equal(result.pagination.hasNextPage, false);
    assert.equal(result.pagination.hasPreviousPage, false);
  } finally {
    productRepository.getAll = originalGetAll;
  }
});

test("getAll calcula correctamente el desplazamiento de página", async () => {
  const originalGetAll = productRepository.getAll;

  productRepository.getAll = async ({ skip, limit }) => {
    assert.equal(skip, 10);
    assert.equal(limit, 5);

    return {
      products: [{ _id: "11", name: "Mouse", stock: 3 }],
      total: 11,
    };
  };

  try {
    const result = await productService.getAll({
      page: "3",
      limit: "5",
    });

    assert.equal(result.pagination.page, 3);
    assert.equal(result.pagination.limit, 5);
    assert.equal(result.pagination.total, 11);
    assert.equal(result.pagination.totalPages, 3);
    assert.equal(result.pagination.hasNextPage, false);
    assert.equal(result.pagination.hasPreviousPage, true);
  } finally {
    productRepository.getAll = originalGetAll;
  }
});

test("getAll rechaza una página inválida", async () => {
  await assert.rejects(
    productService.getAll({ page: "0" }),
    (error) => error.statusCode === 400
  );
});

test("getAll rechaza un límite superior a 50", async () => {
  await assert.rejects(
    productService.getAll({ limit: "51" }),
    (error) => error.statusCode === 400
  );
});

test("getById devuelve error 404 si el producto no existe", async () => {
  const originalGetById = productRepository.getById;

  productRepository.getById = async () => null;

  try {
    await assert.rejects(productService.getById("id-inexistente"), (error) => {
      assert.equal(error.statusCode, 404);
      assert.equal(error.message, "Producto no encontrado.");
      return true;
    });
  } finally {
    productRepository.getById = originalGetById;
  }
});

test("create rechaza productos sin nombre", async () => {
  await assert.rejects(
    productService.create({
      name: "   ",
      price: 1000,
      stock: 5,
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, "El nombre del producto es obligatorio.");
      return true;
    }
  );
});

test("create rechaza precios negativos", async () => {
  await assert.rejects(
    productService.create({
      name: "Teclado",
      price: -100,
      stock: 5,
    }),
    (error) => {
      assert.equal(error.statusCode, 400);
      assert.equal(
        error.message,
        "El precio debe ser un número mayor o igual a cero."
      );
      return true;
    }
  );
});
