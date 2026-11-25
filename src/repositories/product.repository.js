const Product = require("../models/product.model");

const PRODUCT_PROJECTION =
  "name description price stock status createdAt updatedAt";

const AVAILABLE_PRODUCTS_FILTER = {
  stock: { $gt: 0 },
};

class ProductRepository {
  async getAll({ skip = 0, limit = 10 } = {}) {
    const [products, total] = await Promise.all([
      Product.find(AVAILABLE_PRODUCTS_FILTER, PRODUCT_PROJECTION)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(AVAILABLE_PRODUCTS_FILTER),
    ]);

    return { products, total };
  }

  async getById(id) {
    return Product.findById(id, PRODUCT_PROJECTION).lean();
  }

  async create(productData) {
    const product = await Product.create(productData);
    return product.toObject();
  }
}

module.exports = new ProductRepository();
