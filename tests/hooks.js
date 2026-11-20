const {
  connectDatabase,
  clearDatabase,
  disconnectDatabase,
} = require("./helpers/database");

exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(15000);
    await connectDatabase();
  },

  beforeEach: async function () {
    this.timeout(15000);
    await clearDatabase();
  },

  afterAll: async function () {
    this.timeout(15000);

    try {
      await clearDatabase();
    } finally {
      await disconnectDatabase();
    }
  },
};
