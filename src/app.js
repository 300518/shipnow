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

const app = express();

app.use(express.json());

// Documentación Swagger / OpenAPI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Especificación OpenAPI en formato JSON
app.get("/api/docs.json", (req, res) => {
  res.status(200).json(swaggerSpec);
});

// Ruta de comprobación del servicio
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ShipNow API",
  });
});

// Rutas de la API
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mocks", mockRoutes);
app.use("/api/logger", loggerRoutes);
// Alias solicitado para pruebas de logging (solo desa).
if (process.env.NODE_ENV !== "production") {
  app.get("/loggerTest", (req, res, next) =>
    loggerController.test(req, res, next)
  );
}
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);

// Manejo de rutas inexistentes
app.use((req, res, next) => {
  next(new RutaNoEncontradaError());
});

// Middleware centralizado de errores: siempre al final
app.use(errorMiddleware);

module.exports = app;
