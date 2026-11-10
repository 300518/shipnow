const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description:
        "API REST para la gestión de usuarios, productos, pedidos y entregas de ShipNow.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desarrollo",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Gestión de usuarios",
      },
      {
        name: "Products",
        description: "Gestión de productos",
      },
      {
        name: "Orders",
        description: "Gestión de pedidos",
      },
      {
        name: "Deliveries",
        description: "Gestión de entregas",
      },
      {
        name: "Mocks",
        description: "Generación e inserción de datos de prueba",
      },
      {
        name: "Logger",
        description: "Pruebas técnicas del sistema de logging",
      },
    ],
  },
  apis: [path.join(__dirname, "../docs/**/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
