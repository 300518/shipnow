
const productRepository = require('../repositories/product.repository');
const { PRODUCT_STATUS } = require('../constants');

class ProductService {
  async getAll() {
    const products = await productRepository.getAll();

    // Regla de negocio: mostrar solo productos con stock.
    return products.filter((product) => product.stock > 0);
  }

  async getById(id) {
    const product = await productRepository.getById(id);

    if (!product) {
      const error = new Error('Producto no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  async create(data) {
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const description =
      typeof data.description === 'string' ? data.description.trim() : '';

    const price = data.price;
    const stock = data.stock;

    if (!name) {
      const error = new Error('El nombre del producto es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (price === undefined || price === null || price === '') {
      const error = new Error('El precio es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isFinite(price) || price < 0) {
      const error = new Error('El precio debe ser un número mayor o igual a cero.');
      error.statusCode = 400;
      throw error;
    }

    if (
      stock !== undefined &&
      (!Number.isInteger(stock) || stock < 0)
    ) {
      const error = new Error('El stock debe ser un entero mayor o igual a cero.');
      error.statusCode = 400;
      throw error;
    }

    const normalizedStock = stock ?? 0;

    const productData = {
      name,
      description,
      price,
      stock: normalizedStock,
      status:
        normalizedStock > 0
          ? PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK,
    };

    return productRepository.create(productData);
  }
}

module.exports = new ProductService();
