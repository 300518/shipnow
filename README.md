# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para gestionar una plataforma de logística y distribución. Permite administrar usuarios, productos, pedidos, repartidores y entregas.

Incluye generación de datos de prueba, manejo centralizado de errores, logging con Winston y documentación interactiva mediante Swagger / OpenAPI.

## Tecnologías

- Node.js
- Express 5
- MongoDB
- Mongoose
- dotenv
- Winston
- winston-daily-rotate-file
- Swagger UI Express
- swagger-jsdoc
- Supertest
- node:test

## Arquitectura

El proyecto utiliza una arquitectura de tres capas:

- **Controller:** recibe las solicitudes HTTP y devuelve las respuestas.
- **Service:** contiene la lógica de negocio y las validaciones.
- **Repository:** centraliza las operaciones de acceso a MongoDB mediante Mongoose.

Además, utiliza modelos para definir la estructura de los documentos, constantes para los roles y estados, middleware centralizado para el manejo de errores y configuraciones independientes para el entorno, logging y documentación OpenAPI.

## Requisitos previos

- Node.js y npm.
- Una instancia de MongoDB disponible.

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias:

   ```bash
   npm ci
   ```

3. Crear el archivo de configuración local:

   ```bash
   cp .env.example .env
   ```

4. Configurar las variables de entorno en `.env`:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
   NODE_ENV=development
   ```

5. Iniciar el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

   Para iniciar en modo normal:

   ```bash
   npm start
   ```

La API estará disponible en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción |
|---|---|
| PORT | Puerto del servidor |
| MONGODB_URI | Cadena de conexión a MongoDB |
| NODE_ENV | Entorno de ejecución: development, production o test |

Las variables se validan al iniciar la aplicación. No se debe subir el archivo `.env` al repositorio.

## Documentación API – Swagger / OpenAPI

ShipNow incorpora documentación interactiva mediante Swagger UI, generada a partir de especificaciones OpenAPI 3.0.3.

### Acceso a la documentación

| Recurso | URL |
|---|---|
| Swagger UI | `http://localhost:3000/api/docs` |
| Especificación OpenAPI JSON | `http://localhost:3000/api/docs.json` |

Desde Swagger UI es posible consultar los endpoints, revisar parámetros, visualizar los esquemas de datos y ejecutar solicitudes HTTP directamente contra la API.

La documentación incluye los módulos Users, Products, Orders, Deliveries, Mocks y Logger.

## Endpoints

### Salud del servicio

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Comprueba que la API responde |

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Lista productos con stock disponible |
| GET | `/api/products/:id` | Consulta un producto por ID |
| POST | `/api/products` | Crea un producto |

Ejemplo de creación:

```json
{
  "name": "Teclado mecánico Gamer",
  "description": "Teclado para escritorio",
  "price": 49990,
  "stock": 10
}
```

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Lista usuarios |
| GET | `/api/users/:id` | Consulta un usuario por ID |
| POST | `/api/users` | Crea un usuario |
| PATCH | `/api/users/:id` | Actualiza un usuario |
| DELETE | `/api/users/:id` | Elimina un usuario |

Ejemplo de creación:

```json
{
  "name": "Usuario Prueba",
  "email": "usuario@example.com",
  "role": "CUSTOMER"
}
```

Los roles permitidos son `ADMIN`, `USER`, `CUSTOMER` y `COURIER`. Si no se especifica un rol, se asigna `USER` por defecto.

### Pedidos (Orders)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/orders` | Lista pedidos |
| GET | `/api/orders/:id` | Consulta un pedido por ID |
| POST | `/api/orders` | Crea un pedido |

Ejemplo de creación:

```json
{
  "customer": "507f1f77bcf86cd799439011",
  "items": [
    {
      "product": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "shippingAddress": "Av. Providencia 1234, Santiago",
  "priority": "NORMAL"
}
```

El precio unitario y el total del pedido se calculan en el servidor utilizando los precios reales de los productos. No se confía en precios enviados por el cliente.

Las prioridades disponibles son `LOW`, `NORMAL`, `HIGH` y `URGENT`.

Los estados del pedido son `PENDING`, `CONFIRMED`, `PREPARING`, `SHIPPED`, `DELIVERED` y `CANCELLED`.

### Entregas (Deliveries)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/deliveries` | Lista entregas |
| GET | `/api/deliveries/:id` | Consulta una entrega por ID |
| POST | `/api/deliveries` | Registra una entrega |

Ejemplo de creación:

```json
{
  "order": "507f1f77bcf86cd799439011",
  "courier": "507f1f77bcf86cd799439012",
  "estimatedDelivery": "2026-11-15T15:00:00.000Z"
}
```

El campo `courier` es opcional. Cuando se informa, debe corresponder a un usuario existente con rol `COURIER`.

Cada pedido puede tener una única entrega asociada.

Los estados de entrega disponibles son `PENDING`, `ASSIGNED`, `PICKED_UP`, `IN_TRANSIT`, `DELIVERED` y `FAILED`.

### Mocks y datos de prueba

La API permite generar datos ficticios con `@faker-js/faker` para facilitar las pruebas y el desarrollo.

El parámetro `qty` debe ser un entero entre 1 y 50. Si se omite, se utiliza el valor predeterminado de 5.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/mocks/users?qty=5` | Genera usuarios ficticios en memoria |
| GET | `/api/mocks/couriers?qty=5` | Genera repartidores ficticios en memoria |
| GET | `/api/mocks/dataset?qty=5` | Genera un conjunto de datos relacionados |
| POST | `/api/mocks/seed?qty=2` | Inserta datos de prueba en MongoDB |

Ejemplos de uso:

```bash
curl -i "http://localhost:3000/api/mocks/dataset?qty=5"
```

```bash
curl -i -X POST "http://localhost:3000/api/mocks/seed?qty=2"
```

Los endpoints GET generan datos en memoria y no los persisten. El endpoint POST sí inserta registros en MongoDB y cada llamada crea nuevos datos.

El endpoint de seeding está destinado al desarrollo y las pruebas. No debe exponerse públicamente en producción sin controles de acceso apropiados.

## Logging y monitoreo

La API utiliza Winston como sistema centralizado de logging, configurado en `src/config/logger.config.js`.

### Niveles de logging

Se utilizan seis niveles personalizados, ordenados desde mayor a menor severidad:

| Nivel | Descripción |
|---|---|
| `fatal` | Fallas críticas que pueden impedir el funcionamiento del servicio. |
| `error` | Errores inesperados durante la ejecución. |
| `warning` | Situaciones anómalas o validaciones rechazadas. |
| `info` | Eventos relevantes del funcionamiento y operaciones de negocio. |
| `http` | Eventos asociados a solicitudes HTTP. |
| `debug` | Información detallada para diagnóstico durante el desarrollo. |

### Configuración por entorno

- **development:** registra todos los niveles, incluido `debug`.
- **production:** registra desde `info` en adelante.

### Persistencia y rotación de logs

Los registros se almacenan en el directorio `logs/`:

- `application-YYYY-MM-DD.log`: archivo general con los registros de la aplicación.
- `error-YYYY-MM-DD.log`: archivo exclusivo para los niveles `error` y `fatal`.

Los archivos utilizan formato JSON y rotación diaria, además de rotación por tamaño.

| Archivo | Tamaño máximo | Retención |
|---|---:|---:|
| Logs generales | 20 MB | 14 días |
| Logs de errores | 20 MB | 30 días |

El directorio `logs/` está excluido del control de versiones mediante `.gitignore`.

### Endpoints de prueba

En entornos distintos de producción están disponibles los siguientes endpoints para comprobar los seis niveles de logging:

```bash
curl -i http://localhost:3000/api/logger/test
```

También se encuentra disponible el alias solicitado:

```bash
curl -i http://localhost:3000/loggerTest
```

Ambos endpoints ejecutan una prueba de los seis niveles de logging y responden HTTP 200 cuando la operación se completa correctamente.

Estos endpoints no se registran en producción.

## Manejo de errores

La API implementa un sistema centralizado de manejo de errores mediante un middleware global ubicado en `src/middlewares/error.middleware.js`.

Los errores se detectan en la capa correspondiente, se propagan mediante `next(error)` desde los controladores y son procesados por el middleware centralizado.

### Formato estándar de respuesta

Las respuestas de error utilizan la siguiente estructura JSON:

```json
{
  "exito": false,
  "error": {
    "codigo": "USER_NOT_FOUND",
    "mensaje": "El usuario no existe."
  }
}
```

Cuando corresponde, se incluyen detalles adicionales de validación.

### Catálogo de errores

| Código HTTP | Código de error | Descripción |
|---|---|---|
| 400 | `INVALID_DATA` | Datos enviados no válidos |
| 400 | `INVALID_STATUS` | Estado enviado no permitido |
| 400 | `INVALID_MOCK_QUANTITY` | Cantidad de mocks fuera del rango permitido |
| 400 | `INVALID_ID` | Identificador de MongoDB con formato incorrecto |
| 404 | `USER_NOT_FOUND` | Usuario no encontrado |
| 404 | `PRODUCT_NOT_FOUND` | Producto no encontrado |
| 404 | `ORDER_NOT_FOUND` | Pedido no encontrado |
| 404 | `DELIVERY_NOT_FOUND` | Entrega no encontrada |
| 409 | `RESOURCE_ALREADY_EXISTS` | Recurso duplicado |
| 500 | `MOCK_SEED_ERROR` | Error al insertar datos de prueba |
| 500 | `INTERNAL_SERVER_ERROR` | Error interno inesperado |

Los errores inesperados no exponen detalles técnicos ni información interna de la base de datos.

## Pruebas automatizadas

Ejecutar la suite completa:

```bash
npm test
```

El proyecto utiliza `node:test` y Supertest para las pruebas automatizadas y de integración HTTP.

La suite verifica:

- Manejo centralizado de errores.
- Validaciones de datos e identificadores.
- Generación de usuarios, repartidores y datasets.
- Reglas de negocio de productos y pedidos.
- Respuestas HTTP y rutas inexistentes.
- Comportamiento ante errores de persistencia.

Última validación local: 28 tests aprobados y 0 fallidos.

## Estructura del proyecto

```text
src/
├── app.js
├── server.js
├── config/
│   ├── env.config.js
│   ├── logger.config.js
│   └── swagger.config.js
├── constants/
│   └── index.js
├── controllers/
│   ├── delivery.controller.js
│   ├── logger.controller.js
│   ├── mock.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   └── user.controller.js
├── docs/
│   └── swagger.docs.js
├── errors/
│   ├── app.error.js
│   ├── error.dictionary.js
│   └── index.js
├── middlewares/
│   └── error.middleware.js
├── mocks/
│   └── mock.factory.js
├── models/
│   ├── delivery.model.js
│   ├── order.model.js
│   ├── product.model.js
│   └── user.model.js
│   │── delivery.model.js
│   └── order.model.js
├── repositories/
│   ├── delivery.repository.js
│   ├── mock.repository.js
│   ├── order.repository.js
│   ├── product.repository.js
│   └── user.repository.js
├── routes/
│   ├── delivery.routes.js
│   ├── logger.routes.js
│   ├── mock.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   └── user.routes.js
└── services/
    ├── delivery.service.js
    ├── mock.service.js
    ├── order.service.js
    ├── product.service.js
    └── user.service.js

test/
├── error.middleware.test.js
├── integration.test.js
├── mock.service.test.js
├── order.service.test.js
├── product.service.test.js
└── user.service.test.js
```

## ¿Por qué separar Service y Repository?

El Service concentra las reglas de negocio y las validaciones sin depender directamente de Mongoose. El Repository encapsula las consultas y operaciones de persistencia.

Esta separación facilita el mantenimiento, las pruebas y la evolución del proyecto.

## Seguridad

- Las credenciales y la configuración local se mantienen en `.env`.
- El archivo `.env` está excluido del control de versiones.
- `.env.example` permite conocer las variables necesarias sin exponer valores locales.
- Los endpoints de prueba de logging y generación de datos deben mantenerse restringidos a entornos de desarrollo o protegidos antes de una exposición pública.
