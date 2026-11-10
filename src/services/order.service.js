const orderRepository = require("../repositories/order.repository");
const productRepository = require("../repositories/product.repository");
const userRepository = require("../repositories/user.repository");

const {
  PedidoNoEncontradoError,
  ProductoNoEncontradoError,
  UsuarioNoEncontradoError,
  DatosInvalidosError,
} = require("../errors");

const logger = require("../config/logger.config");

function validateId(id, parametro = "id") {
  const isValid = typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

  if (!isValid) {
    throw new DatosInvalidosError({
      parametro,
      valor: id,
    });
  }
}

class OrderService {
  async getAll() {
    return orderRepository.getAll();
  }

  async getById(id) {
    validateId(id);

    const order = await orderRepository.getById(id);

    if (!order) {
      throw new PedidoNoEncontradoError();
    }

    return order;
  }

  async create(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new DatosInvalidosError();
    }

    const { customer, items, shippingAddress, priority } = data;

    if (!customer || !Array.isArray(items) || items.length === 0) {
      throw new DatosInvalidosError({
        mensaje: "El cliente y al menos un producto son obligatorios.",
      });
    }

    validateId(customer, "customer");

    if (
      !shippingAddress ||
      typeof shippingAddress !== "string" ||
      !shippingAddress.trim()
    ) {
      throw new DatosInvalidosError({
        parametro: "shippingAddress",
        mensaje: "La dirección de envío es obligatoria.",
      });
    }

    // Validar estructura de los productos antes de consultar MongoDB
    for (const item of items) {
      if (
        !item ||
        !item.product ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        throw new DatosInvalidosError({
          parametro: "items",
          mensaje: "Los productos y cantidades no son válidos.",
        });
      }

      validateId(item.product, "product");
    }

    // Validar que el cliente exista
    const existingCustomer = await userRepository.getById(customer);

    if (!existingCustomer) {
      throw new UsuarioNoEncontradoError();
    }

    // Obtener los productos y sus precios reales desde la base de datos
    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await productRepository.getById(item.product);

        if (!product) {
          throw new ProductoNoEncontradoError();
        }

        return {
          product: product._id,
          quantity: item.quantity,
          unitPrice: product.price,
        };
      })
    );

    // Calcular el total utilizando los precios reales
    const total = validatedItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const orderData = {
      customer,
      items: validatedItems,
      total,
      shippingAddress: shippingAddress.trim(),
      priority,
    };

    const newOrder = await orderRepository.create(orderData);

    logger.info("Pedido creado correctamente", {
      pedidoId: newOrder._id.toString(),
      clienteId: customer,
      total,
    });

    return newOrder;
  }
}

module.exports = new OrderService();
