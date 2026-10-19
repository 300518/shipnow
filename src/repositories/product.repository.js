
const Product = require('../models/product.model');

class ProductRepository {
  async getAll() {
    return Product.find(
      {},
      'name description price stock status createdAt updatedAt'
    )
      .sort({ createdAt: -1 })
      .lean();
  }

  async getById(id) {
    return Product.findById(
      id,
      'name description price stock status createdAt updatedAt'
    ).lean();
  }

  async create(productData) {
    const product = await Product.create(productData);
    return product.toObject();
  }
}

module.exports = new ProductRepository();
