const mockService = require("../services/mock.service");

class MockController {
  getUsers(req, res, next) {
    try {
      const users = mockService.generateUsers(req.query.qty);
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  }

  getCouriers(req, res, next) {
    try {
      const couriers = mockService.generateCouriers(req.query.qty);
      return res.status(200).json(couriers);
    } catch (error) {
      return next(error);
    }
  }

  getDataset(req, res, next) {
    try {
      const dataset = mockService.generateDataset(req.query.qty);
      return res.status(200).json(dataset);
    } catch (error) {
      return next(error);
    }
  }

  async seed(req, res, next) {
    try {
      const result = await mockService.seed(req.query.qty ?? req.body?.qty);

      return res.status(201).json({
        message: "Datos de prueba insertados correctamente.",
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new MockController();
