const express = require("express");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const mockRoutes = require("./routes/mock.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

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

// Middleware centralizado de errores: siempre al final
app.use(errorMiddleware);

module.exports = app;
