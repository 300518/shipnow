const express = require("express");
const deliveryController = require("../controllers/delivery.controller");
const { deliveryProofUpload } = require("../config/multer.config");

const router = express.Router();

router.get("/", deliveryController.getAll);
router.post(
  "/:id/proof",
  deliveryProofUpload.single("file"),
  deliveryController.uploadProof
);
router.get("/:id", deliveryController.getById);
router.post("/", deliveryController.create);

module.exports = router;
