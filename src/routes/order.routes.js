const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);
router.post("/", orderController.create);

module.exports = router;
