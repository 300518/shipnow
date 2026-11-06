const productRepository = require("../repositories/product.repository");
const logger = require("../config/logger.config");
const { PRODUCT_STATUS } = require("../constants");
const { ProductoNoEncontradoError, DatosInvalidosError } = require("../errors");

class ProductService {
  async getAll() {
    const products = await productRepository.getAll();

    // Regla de negocio: mostrar solo productos con stock.
    return products.filter((product) => product.stock > 0);
  }

  async getById(id) {
    const product = await productRepository.getById(id);

    if (!product) {
      throw new ProductoNoEncontradoError();
    }

    return product;
  }

  async create(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new DatosInvalidosError();
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const description =
      typeof data.description === "string" ? data.description.trim() : "";

    const price = data.price;
    const stock = data.stock;

    if (!name) {
      throw new DatosInvalidosError(
        { parametro: "name" },
        "El nombre del producto es obligatorio."
      );
    }

    if (price === undefined || price === null || price === "") {
      throw new DatosInvalidosError(
        { parametro: "price" },
        "El precio es obligatorio."
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new DatosInvalidosError(
        { parametro: "price" },
        "El precio debe ser un número mayor o igual a cero."
      );
    }

    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
      throw new DatosInvalidosError(
        { parametro: "stock" },
        "El stock debe ser un entero mayor o igual a cero."
      );
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

    const newProduct = await productRepository.create(productData);

    logger.info("Producto creado correctamente", {
      productoId: newProduct._id.toString(),
      nombre: newProduct.name,
      precio: newProduct.price,
      stock: newProduct.stock,
    });

    return newProduct;
  }
}

module.exports = new ProductService();
