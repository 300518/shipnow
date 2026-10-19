const productService = require("../services/product.service");

class ProductController {
  async getAll(req, res, next) {
    try {
      const products = await productService.getAll();
      return res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      return res.status(200).json({ data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      return res.status(201).json({ data: product });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
