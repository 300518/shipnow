const express = require("express");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");

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

// Middleware centralizado de errores: siempre al final
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    error: statusCode === 500 ? "Error interno del servidor." : err.message,
  });
});

module.exports = app;
