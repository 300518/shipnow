/**
 * @openapi
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         data:
 *           description: Datos devueltos por la API.
 *           oneOf:
 *             - type: object
 *             - type: array
 *               items:
 *                 type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         exito:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             codigo:
 *               type: string
 *               example: INVALID_DATA
 *             mensaje:
 *               type: string
 *               example: Los datos enviados no son válidos.
 *             detalles:
 *               type: object
 *               nullable: true
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           format: email
 *           example: juan@email.com
 *         role:
 *           type: string
 *           enum: [ADMIN, USER, CUSTOMER, COURIER]
 *           example: CUSTOMER
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: Teclado mecánico
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 49990
 *         stock:
 *           type: integer
 *           minimum: 0
 *           example: 10
 *         status:
 *           type: string
 *           enum: [AVAILABLE, OUT_OF_STOCK]
 *
 *     OrderItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - unitPrice
 *       properties:
 *         product:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         unitPrice:
 *           type: number
 *           minimum: 0
 *           example: 49990
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customer:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total:
 *           type: number
 *           example: 99980
 *         shippingAddress:
 *           type: string
 *           example: Av. Providencia 1234, Santiago
 *         status:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED]
 *         priority:
 *           type: string
 *           enum: [LOW, NORMAL, HIGH, URGENT]
 *
 *     Delivery:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         order:
 *           type: string
 *         courier:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [PENDING, ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED]
 *         estimatedDelivery:
 *           type: string
 *           format: date-time
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Crear usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@email.com
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER, CUSTOMER, COURIER]
 *                 example: CUSTOMER
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: El correo electrónico ya está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Identificador MongoDB del usuario.
 *       example: 507f1f77bcf86cd799439011
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   patch:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez Actualizado
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.actualizado@email.com
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER, CUSTOMER, COURIER]
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos o identificador inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: El correo electrónico ya está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado correctamente.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Listar productos disponibles
 *     description: Devuelve únicamente productos cuyo stock sea mayor que cero.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Productos disponibles obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Crear producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Teclado mecánico
 *               description:
 *                 type: string
 *                 example: Teclado mecánico retroiluminado.
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 49990
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 example: 10
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos del producto inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/products/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Identificador MongoDB del producto.
 *       example: 507f1f77bcf86cd799439011
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Crear pedido
 *     description: El precio unitario y el total se calculan desde los precios reales de los productos.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - items
 *               - shippingAddress
 *             properties:
 *               customer:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [product, quantity]
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *               shippingAddress:
 *                 type: string
 *                 example: Av. Providencia 1234, Santiago
 *               priority:
 *                 type: string
 *                 enum: [LOW, NORMAL, HIGH, URGENT]
 *                 default: NORMAL
 *     responses:
 *       201:
 *         description: Pedido creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos del pedido inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cliente o producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/orders/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Identificador MongoDB del pedido.
 *       example: 507f1f77bcf86cd799439013
 *   get:
 *     summary: Obtener pedido por ID
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Pedido encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/deliveries:
 *   get:
 *     summary: Listar entregas
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: Lista de entregas obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Delivery'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Crear entrega
 *     description: El repartidor es opcional. Si se informa, debe existir y tener el rol COURIER. Cada pedido solo puede tener una entrega.
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order
 *               - estimatedDelivery
 *             properties:
 *               order:
 *                 type: string
 *                 description: ID del pedido asociado.
 *                 example: 507f1f77bcf86cd799439011
 *               courier:
 *                 type: string
 *                 nullable: true
 *                 description: ID del usuario repartidor (opcional).
 *                 example: 507f1f77bcf86cd799439012
 *               estimatedDelivery:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-15T15:00:00.000Z"
 *     responses:
 *       201:
 *         description: Entrega creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Datos inválidos o repartidor incorrecto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: El pedido ya tiene una entrega registrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/deliveries/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Identificador MongoDB de la entrega.
 *       example: 507f1f77bcf86cd799439013
 *   get:
 *     summary: Obtener entrega por ID
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: Entrega encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Identificador inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entrega no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/mocks/users:
 *   get:
 *     summary: Generar usuarios de prueba
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         description: Cantidad de usuarios a generar.
 *     responses:
 *       200:
 *         description: Usuarios generados correctamente.
 *       400:
 *         description: Cantidad inválida. Debe ser un entero entre 1 y 50.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/mocks/couriers:
 *   get:
 *     summary: Generar repartidores de prueba
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         description: Cantidad de repartidores a generar.
 *     responses:
 *       200:
 *         description: Repartidores generados correctamente.
 *       400:
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/mocks/dataset:
 *   get:
 *     summary: Generar conjunto de datos relacionados
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         description: Cantidad de registros a generar.
 *     responses:
 *       200:
 *         description: Conjunto de datos generado correctamente.
 *       400:
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/mocks/seed:
 *   post:
 *     summary: Insertar datos de prueba en MongoDB
 *     description: La cantidad puede enviarse mediante query string o en el cuerpo JSON.
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Cantidad de registros a insertar.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qty:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 default: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Datos de prueba insertados correctamente.
 *       400:
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al insertar los datos de prueba.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/logger/test:
 *   get:
 *     summary: Probar los niveles de logging
 *     description: Endpoint disponible únicamente fuera del entorno de producción. Ejecuta una prueba de los seis niveles de logging configurados.
 *     tags: [Logger]
 *     responses:
 *       200:
 *         description: Prueba de logging ejecutada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exito:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: Prueba de logging ejecutada correctamente.
 *                 niveles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - fatal
 *                     - error
 *                     - warning
 *                     - info
 *                     - http
 *                     - debug
 */
