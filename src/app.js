const express = require("express");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const mockRoutes = require("./routes/mock.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const loggerRoutes = require("./routes/logger.routes");
const { RutaNoEncontradaError } = require("./errors");
const orderRoutes = require("./routes/order.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");
const loggerController = require("./controllers/logger.controller");
const uploadErrorMiddleware = require("./middlewares/upload-error.middleware");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json());

// Swagger: disponible solamente en desarrollo y pruebas.
if (!isProduction) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api/docs.json", (req, res) => {
    res.status(200).json(swaggerSpec);
  });
}

// Health Check: disponible en todos los entornos.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ShipNow API",
    environment: process.env.NODE_ENV || "development",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Endpoints principales: disponibles en todos los entornos.
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);

// Endpoints internos: solamente desarrollo y pruebas.
if (!isProduction) {
  app.use("/api/mocks", mockRoutes);
  app.use("/api/logger", loggerRoutes);

  app.get("/loggerTest", (req, res, next) =>
    loggerController.test(req, res, next)
  );
}

// Manejo de rutas inexistentes.
app.use((req, res, next) => {
  next(new RutaNoEncontradaError());
});

// Transformación de errores específicos de Multer.
app.use(uploadErrorMiddleware);

// Middleware centralizado de errores: siempre al final.
app.use(errorMiddleware);

module.exports = app;
