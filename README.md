# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para gestionar
usuarios y productos.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- Winston
- Supertest

## Arquitectura

El proyecto utiliza una arquitectura de tres capas:

- **Controller:** recibe las solicitudes HTTP y devuelve las respuestas.
- **Service:** contiene la lógica de negocio y las validaciones.
- **Repository:** centraliza las operaciones de acceso a MongoDB mediante Mongoose.

Además, utiliza modelos para definir la estructura de los documentos,
constantes para los roles y estados, y una configuración centralizada
para validar las variables de entorno.

## Requisitos previos

- Node.js y npm.
- Una instancia de MongoDB disponible.

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias:

   ```bash
   npm install
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

| Variable    | Descripción                                          |
| ----------- | ---------------------------------------------------- |
| PORT        | Puerto del servidor                                  |
| MONGODB_URI | Cadena de conexión a MongoDB                         |
| NODE_ENV    | Entorno de ejecución: development, production o test |

Las variables se validan al iniciar la aplicación. No se debe subir el
archivo `.env` al repositorio.

## Endpoints

### Salud del servicio

| Método | Ruta      | Descripción                   |
| ------ | --------- | ----------------------------- |
| GET    | `/health` | Comprueba que la API responde |

### Productos

| Método | Ruta                | Descripción                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/api/products`     | Lista productos con stock disponible |
| GET    | `/api/products/:id` | Consulta un producto por ID          |
| POST   | `/api/products`     | Crea un producto                     |

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

| Método | Ruta             | Descripción                |
| ------ | ---------------- | -------------------------- |
| GET    | `/api/users`     | Lista usuarios             |
| GET    | `/api/users/:id` | Consulta un usuario por ID |
| POST   | `/api/users`     | Crea un usuario            |
| PATCH  | `/api/users/:id` | Actualiza un usuario       |
| DELETE | `/api/users/:id` | Elimina un usuario         |

Ejemplo de creación:

```json
{
  "name": "Usuario Prueba",
  "email": "usuario@example.com"
}
```

Si no se especifica un rol, se asigna `USER` por defecto.
Los roles permitidos son `ADMIN` y `USER`.

## Mocks y datos de prueba

La API permite generar datos ficticios con `@faker-js/faker` para facilitar
las pruebas y el desarrollo.

El parámetro `qty` debe ser un entero entre 1 y 50. Si se omite, se utiliza
el valor predeterminado de 5.

| Método | Ruta                        | Descripción                                                               |
| ------ | --------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/mocks/users?qty=5`    | Genera usuarios ficticios en memoria                                      |
| GET    | `/api/mocks/couriers?qty=5` | Genera repartidores ficticios en memoria                                  |
| GET    | `/api/mocks/dataset?qty=5`  | Genera clientes, repartidores, productos, pedidos y entregas relacionados |
| POST   | `/api/mocks/seed?qty=2`     | Inserta datos de prueba en MongoDB                                        |

Ejemplos de uso:

```bash
curl -i "http://localhost:3000/api/mocks/dataset?qty=5"
```

```bash
curl -i -X POST "http://localhost:3000/api/mocks/seed?qty=2"
```

Los endpoints GET generan datos en memoria y no los persisten. El endpoint
POST sí inserta registros en MongoDB y cada llamada crea nuevos datos.

El endpoint de seeding está destinado al desarrollo y las pruebas. No debe
exponerse públicamente en producción sin controles de acceso apropiados.

## Pruebas automatizadas

Ejecutar las pruebas con:

```bash
npm test
```

Las pruebas utilizan `node:test` y comprueban reglas de negocio de productos,
generación de datos, relaciones y validación de parámetros. Las pruebas
actuales no requieren insertar registros en MongoDB.

## Manejo de errores

La API implementa un sistema centralizado de manejo de errores mediante un middleware global ubicado en `src/middlewares/error.middleware.js`.

Los errores se detectan en la capa correspondiente (principalmente en los servicios), se propagan mediante `next(error)` desde los controladores y son procesados por el middleware centralizado.

### Formato estándar de respuesta

Todas las respuestas de error utilizan la siguiente estructura JSON:

```json
{
  "exito": false,
  "error": {
    "codigo": "USER_NOT_FOUND",
    "mensaje": "El usuario no existe."
  }
}
```

Cuando corresponde, se incluyen detalles adicionales:

```json
{
  "exito": false,
  "error": {
    "codigo": "INVALID_MOCK_QUANTITY",
    "mensaje": "La cantidad debe ser un entero entre 1 y 50.",
    "detalles": {
      "parametro": "qty",
      "valor": "-5",
      "minimo": 1,
      "maximo": 50
    }
  }
}
```

### Catálogo de errores

| Código HTTP | Código de error           | Descripción                                       |
| ----------- | ------------------------- | ------------------------------------------------- |
| 400         | `INVALID_DATA`            | Datos enviados no válidos.                        |
| 400         | `INVALID_STATUS`          | Estado enviado no permitido.                      |
| 400         | `INVALID_MOCK_QUANTITY`   | Cantidad de mocks fuera del rango permitido.      |
| 400         | `INVALID_ID`              | Identificador de MongoDB con formato incorrecto.  |
| 404         | `USER_NOT_FOUND`          | Usuario no encontrado.                            |
| 404         | `PRODUCT_NOT_FOUND`       | Producto no encontrado.                           |
| 404         | `ORDER_NOT_FOUND`         | Pedido no encontrado.                             |
| 404         | `DELIVERY_NOT_FOUND`      | Entrega no encontrada.                            |
| 409         | `RESOURCE_ALREADY_EXISTS` | Recurso duplicado, por ejemplo, correo existente. |
| 500         | `MOCK_SEED_ERROR`         | Error al insertar datos de prueba.                |
| 500         | `INTERNAL_SERVER_ERROR`   | Error interno inesperado.                         |

Los errores inesperados no exponen detalles técnicos ni información interna de la base de datos.

### Ejemplos de pruebas de errores

**1. Cantidad de mocks inválida**

```bash
curl -i "http://localhost:3000/api/mocks/users?qty=-5"
```

Respuesta esperada: HTTP 400 (`INVALID_MOCK_QUANTITY`).

**2. Cantidad decimal de mocks**

```bash
curl -i "http://localhost:3000/api/mocks/users?qty=2.5"
```

Respuesta esperada: HTTP 400 (`INVALID_MOCK_QUANTITY`).

**3. Producto inexistente**

```bash
curl -i "http://localhost:3000/api/products/507f1f77bcf86cd799439011"
```

Respuesta esperada: HTTP 404 (`PRODUCT_NOT_FOUND`), si el ID tiene formato válido y el producto no existe.

**4. Datos inválidos al crear un producto**

```bash
curl -i -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"","price":-100,"stock":5}'
```

Respuesta esperada: HTTP 400 (`INVALID_DATA`).

**5. Error al cargar datos de prueba**

Si ocurre un fallo durante la persistencia de los mocks, el servicio transforma el error del repositorio en `MOCK_SEED_ERROR`.

Respuesta esperada: HTTP 500, sin exponer detalles internos de MongoDB.

### Pruebas automatizadas

Ejecutar todas las pruebas:

```bash
npm test
```

La suite utiliza `node:test` y cubre errores personalizados, errores inesperados, validaciones de MongoDB, identificadores inválidos, registros duplicados y fallos en la carga de datos de prueba.

## Logging y monitoreo

La API utiliza **Winston** como sistema centralizado de logging, configurado en `src/config/logger.config.js`.

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

Los archivos utilizan formato JSON y rotación diaria. Cada archivo tiene un tamaño máximo de 20 MB.

- Logs generales: retención de 14 días.
- Logs de errores: retención de 30 días.

El directorio `logs/` está excluido del control de versiones mediante `.gitignore`.

### Eventos registrados

Se registran eventos relevantes como:

- Inicio del servidor y conexión a MongoDB.
- Generación y persistencia de datos de prueba.
- Creación, actualización y eliminación de usuarios.
- Creación de productos.
- Validaciones rechazadas y cantidades de mocks inválidas.
- Rutas inexistentes y errores de la aplicación.

### Endpoint de prueba

En entorno de desarrollo está disponible un endpoint para comprobar los seis niveles de logging:

```bash
curl -i http://localhost:3000/api/logger/test
```

La respuesta HTTP 200 confirma que la prueba se ejecutó. Los seis niveles quedan registrados en el archivo general y los niveles `error` y `fatal` también en el archivo exclusivo de errores.

Este endpoint no se registra en producción.

### Pruebas automatizadas

Las pruebas de integración HTTP utilizan Supertest junto con `node:test`.

Ejecutar la suite completa:

```bash
npm test
```

Las pruebas verifican respuestas HTTP, validaciones, generación de datos y manejo de rutas inexistentes.

## Estructura del proyecto

```text
src/
├── app.js
├── server.js
├── config/
│   ├── env.config.js
│   └── logger.config.js
├── constants/
│   └── index.js
├── controllers/
│   ├── logger.controller.js
│   ├── mock.controller.js
│   ├── product.controller.js
│   └── user.controller.js
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
├── repositories/
│   ├── mock.repository.js
│   ├── product.repository.js
│   └── user.repository.js
├── routes/
│   ├── logger.routes.js
│   ├── mock.routes.js
│   ├── product.routes.js
│   └── user.routes.js
└── services/
    ├── mock.service.js
    ├── product.service.js
    └── user.service.js
test/
├── error.middleware.test.js
├── integration.test.js
├── mock.service.test.js
├── product.service.test.js
└── user.service.test.js
```

## ¿Por qué separar Service y Repository?

El Service concentra las reglas de negocio y las validaciones sin depender
directamente de Mongoose. El Repository encapsula las consultas y operaciones
de persistencia.

Esta separación facilita el mantenimiento, las pruebas y la evolución del
proyecto.

## Seguridad

- Las credenciales y la configuración local se mantienen en `.env`.
- El archivo `.env` está excluido del control de versiones.
- `.env.example` permite conocer las variables necesarias sin exponer valores
  locales.
