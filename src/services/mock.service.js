const { createMockDataset, createMockUser } = require("../mocks/mock.factory");
const mockRepository = require("../repositories/mock.repository");
const { USER_ROLES } = require("../constants");
const { CantidadMockInvalidaError, ErrorAlCargarMocks } = require("../errors");
const logger = require("../config/logger.config");

const DEFAULT_QTY = 5;
const MAX_QTY = 50;

function validateQty(qty) {
  const normalizedQty = qty === undefined ? DEFAULT_QTY : Number(qty);

  if (
    !Number.isInteger(normalizedQty) ||
    normalizedQty < 1 ||
    normalizedQty > MAX_QTY
  ) {
    logger.warning("Cantidad de mocks inválida", {
      parametro: "qty",
      valor: qty,
      minimo: 1,
      maximo: MAX_QTY,
    });
    throw new CantidadMockInvalidaError({
      parametro: "qty",
      valor: qty,
      minimo: 1,
      maximo: MAX_QTY,
    });
  }

  return normalizedQty;
}

class MockService {
  generateUsers(qty) {
    const count = validateQty(qty);

    return Array.from({ length: count }, (_, index) =>
      createMockUser(index % 2 === 0 ? USER_ROLES.CUSTOMER : USER_ROLES.COURIER)
    );
  }

  generateCouriers(qty) {
    const count = validateQty(qty);

    return Array.from({ length: count }, () =>
      createMockUser(USER_ROLES.COURIER)
    );
  }

  generateDataset(qty) {
    const count = validateQty(qty);
    return createMockDataset(count);
  }

  async seed(qty) {
    const dataset = this.generateDataset(qty);

    try {
      const resultado = await mockRepository.seed(dataset);

      logger.info("Datos de prueba cargados correctamente", {
        usuarios: dataset.users.length,
        productos: dataset.products.length,
        pedidos: dataset.orders.length,
        repartidores: dataset.couriers.length,
      });

      return resultado;
    } catch (error) {
      logger.error("Error al cargar los datos de prueba", {
        mensaje: error.message,
        stack: error.stack,
      });

      throw new ErrorAlCargarMocks();
    }
  }
}

module.exports = new MockService();
