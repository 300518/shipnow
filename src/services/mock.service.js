const { createMockDataset, createMockUser } = require("../mocks/mock.factory");
const mockRepository = require("../repositories/mock.repository");
const { USER_ROLES } = require("../constants");
const { CantidadMockInvalidaError, ErrorAlCargarMocks } = require("../errors");

const DEFAULT_QTY = 5;
const MAX_QTY = 50;

function validateQty(qty) {
  const normalizedQty = qty === undefined ? DEFAULT_QTY : Number(qty);

  if (
    !Number.isInteger(normalizedQty) ||
    normalizedQty < 1 ||
    normalizedQty > MAX_QTY
  ) {
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
      return await mockRepository.seed(dataset);
    } catch (error) {
      console.error("Error al cargar los datos de prueba:", error.message);
      throw new ErrorAlCargarMocks();
    }
  }
}

module.exports = new MockService();
