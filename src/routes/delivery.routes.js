const express = require("express");
const deliveryController = require("../controllers/delivery.controller");

const router = express.Router();

router.get("/", deliveryController.getAll);
router.get("/:id", deliveryController.getById);
router.post("/", deliveryController.create);

module.exports = router;
