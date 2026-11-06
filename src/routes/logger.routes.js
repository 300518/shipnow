const express = require("express");
const loggerController = require("../controllers/logger.controller");

const router = express.Router();
if (process.env.NODE_ENV !== "production") {
  router.get("/test", (req, res, next) =>
    loggerController.test(req, res, next)
  );
}

module.exports = router;
