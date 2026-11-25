const productService = require("../services/product.service");

class ProductController {
  async getAll(req, res, next) {
    try {
      const result = await productService.getAll(req.query);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      return res.status(200).json({ data: product });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      return res.status(201).json({ data: product });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ProductController();
