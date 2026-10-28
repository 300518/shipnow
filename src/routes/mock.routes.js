const express = require("express");
const mockController = require("../controllers/mock.controller");

const router = express.Router();

router.get("/users", (req, res, next) =>
  mockController.getUsers(req, res, next)
);

router.get("/couriers", (req, res, next) =>
  mockController.getCouriers(req, res, next)
);

router.get("/dataset", (req, res, next) =>
  mockController.getDataset(req, res, next)
);

router.post("/seed", (req, res, next) => mockController.seed(req, res, next));

module.exports = router;
