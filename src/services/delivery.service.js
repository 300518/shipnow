const deliveryRepository = require("../repositories/delivery.repository");
const orderRepository = require("../repositories/order.repository");
const userRepository = require("../repositories/user.repository");
const {
  EntregaNoEncontradaError,
  PedidoNoEncontradoError,
  DatosInvalidosError,
  RecursoDuplicadoError,
} = require("../errors");
const logger = require("../config/logger.config");

function validateId(id) {
  const isValid = typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

  if (!isValid) {
    throw new DatosInvalidosError({
      parametro: "id",
      valor: id,
    });
  }
}

class DeliveryService {
  async getAll() {
    return deliveryRepository.getAll();
  }

  async getById(id) {
    validateId(id);

    const delivery = await deliveryRepository.getById(id);

    if (!delivery) {
      throw new EntregaNoEncontradaError();
    }

    return delivery;
  }

  async create(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new DatosInvalidosError();
    }

    const { order, courier, estimatedDelivery } = data;

    if (!order || !estimatedDelivery) {
      throw new DatosInvalidosError({
        mensaje: "El pedido y la fecha estimada son obligatorios.",
      });
    }

    const deliveryDate = new Date(estimatedDelivery);

    if (Number.isNaN(deliveryDate.getTime())) {
      throw new DatosInvalidosError({
        parametro: "estimatedDelivery",
        valor: estimatedDelivery,
        mensaje: "La fecha estimada de entrega no es válida.",
      });
    }

    validateId(order);

    if (courier) {
      validateId(courier);
    }

    const existingOrder = await orderRepository.getById(order);

    if (!existingOrder) {
      throw new PedidoNoEncontradoError();
    }

    if (courier) {
      const existingCourier = await userRepository.getById(courier);

      if (!existingCourier) {
        throw new DatosInvalidosError({
          parametro: "courier",
          valor: courier,
          mensaje: "El repartidor indicado no existe.",
        });
      }

      if (existingCourier.role !== "COURIER") {
        throw new DatosInvalidosError({
          parametro: "courier",
          valor: courier,
          mensaje: "El usuario indicado no tiene el rol de repartidor.",
        });
      }
    }

    const deliveryData = {
      order,
      courier: courier || null,
      estimatedDelivery: deliveryDate,
    };

    try {
      const newDelivery = await deliveryRepository.create(deliveryData);

      logger.info("Entrega creada correctamente", {
        entregaId: newDelivery._id.toString(),
        pedidoId: order,
        repartidorId: courier || null,
      });

      return newDelivery;
    } catch (error) {
      if (error.code === 11000) {
        throw new RecursoDuplicadoError({
          parametro: "order",
          valor: order,
        });
      }

      throw error;
    }
  }
}

module.exports = new DeliveryService();
