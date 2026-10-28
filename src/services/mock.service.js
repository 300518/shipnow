const { createMockDataset, createMockUser } = require("../mocks/mock.factory");
const mockRepository = require("../repositories/mock.repository");
const { USER_ROLES } = require("../constants");

const DEFAULT_QTY = 5;
const MAX_QTY = 50;

function validateQty(qty) {
  const normalizedQty = qty === undefined ? DEFAULT_QTY : Number(qty);

  if (
    !Number.isInteger(normalizedQty) ||
    normalizedQty < 1 ||
    normalizedQty > MAX_QTY
  ) {
    const error = new Error(
      `El parámetro qty debe ser un entero entre 1 y ${MAX_QTY}.`
    );
    error.statusCode = 400;
    throw error;
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
    return mockRepository.seed(dataset);
  }
}

module.exports = new MockService();
