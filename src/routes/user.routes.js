const express = require("express");
const userController = require("../controllers/user.controller");
const { userDocumentUpload } = require("../config/multer.config");

const router = express.Router();

router.get("/", userController.getAll);
router.post(
  "/:id/documents",
  userDocumentUpload.single("file"),
  userController.uploadDocument
);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.patch("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router;
