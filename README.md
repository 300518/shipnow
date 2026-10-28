# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para gestionar
usuarios y productos.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv

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

La API utiliza un middleware centralizado para devolver errores en formato
JSON y códigos HTTP apropiados.

Las variables de entorno obligatorias se validan al iniciar el servidor.
Los datos de usuarios y productos se validan en la capa de servicios y
también mediante las restricciones de los modelos.

## Estructura del proyecto

```text
src/
├── app.js
├── server.js
├── config/
│   └── env.config.js
├── constants/
│   └── index.js
├── controllers/
│   ├── mock.controller.js
│   ├── product.controller.js
│   └── user.controller.js
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
│   ├── mock.routes.js
│   ├── product.routes.js
│   └── user.routes.js
└── services/
    ├── mock.service.js
    ├── product.service.js
    └── user.service.js

test/
├── mock.service.test.js
└── product.service.test.js
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
