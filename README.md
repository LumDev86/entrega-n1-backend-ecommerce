# 🛒 E-commerce API

API para la gestión de un e-commerce con **Node.js + Express + MongoDB (Mongoose)**.  
Incluye autenticación de usuarios, manejo de productos, carritos de compras y generación de tickets.

---

## 📌 Tecnologías

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Bcrypt
- Postman (para pruebas)

---

## Instalación del proyecto

**Clonar repositorio:**

```bash
git clone https://github.com/LumDev86/entrega-n1-backend-ecommerce.git
```
**Accede a la carpeta del proyecto:**
```bash
cd entrega-n1-backend-ecommerce
```

**Instalar dependencias:**
```bash
npm install
```

**Configurar variables de entorno (crear archivo .env):**
```bash
PORT=Puerto
MONGO_URI=uriMongo
JWT_SECRET=secretJwt
JWT_EXPIRES=1h

# Mail (nodemailer)
EMAIL_HOST=HostEmail
EMAIL_USER=Correo
EMAIL_PASSWORD=PasswordApi
```

**Arrancar el servidor**
```bash
npm run dev || npm stard
```
---------------------------------------------------------
<br>

## Arquitectura del proyecto

```
src/
├── config/              # Configuraciones (DB, Passport, Nodemailer)
├── models/              # Modelos de Mongoose
├── dao/                 # Data Access Objects
├── repositories/        # Patrón Repository
├── dto/                 # Data Transfer Objects
├── services/            # Lógica de negocio
├── controllers/         # Controladores
├── middlewares/         # Middlewares (auth, authorization, errors)
├── routes/              # Rutas de Express
├── utils/               # Utilidades (bcrypt, jwt)
└── app.js               # Punto de entrada
```

---

## Características Implementadas

### 1. Patrón Repository 
- Separación clara entre acceso a datos (DAO) y lógica de negocio (Services)
- Repositories como capa intermedia

### 2. DTOs (Data Transfer Objects) 
- `UserDTO`: Oculta información sensible en `/current`
- `ProductDTO`: Formato consistente de productos
- `TicketDTO`: Estructura de tickets de compra

### 3. Sistema de Recuperación de Contraseña 
- Envío de email con token único
- Token expira en 1 hora
- Validación para evitar reutilizar contraseña anterior
- Templates HTML

### 4. Middleware de Autorización 
- `isAdmin`: Solo administradores
- `isUser`: Solo usuarios regulares
- `authorize(...roles)`: Autorización flexible por roles
- `isOwner`: Verificación de propiedad de recursos

### 5. Arquitectura Profesional 
- Separación en capas
- Variables de entorno con dotenv
- Manejo centralizado de errores
- Mailing con Nodemailer

### 6. Lógica de Compra Avanzada 
- Modelo `Ticket` con todos los campos requeridos
- Verificación de stock
- Compras parciales (algunos productos sin stock)
- Actualización automática de stock
- Email de confirmación

## Roles y Permisos

### Admin
- Crear, actualizar y eliminar productos
- Ver todos los usuarios
- CRUD completo de usuarios
- No puede comprar (no tiene carrito funcional)

### User
- Agregar productos al carrito
- Realizar compras
- Ver sus propios tickets
- No puede gestionar productos


## Endpoints

### Sesiones (/api/sessions)

```
POST   /register                    - Registrar usuario
POST   /login                       - Iniciar sesión
GET    /current                     - Usuario actual (protegido, DTO)
POST   /request-password-reset      - Solicitar recuperación
POST   /reset-password              - Restablecer contraseña
GET    /validate-reset-token/:token - Validar token
POST   /logout                      - Cerrar sesión

```

### Usuarios (/api/users) - Solo Admin

```
GET    /                - Listar usuarios
GET    /:id             - Obtener usuario
POST   /                - Crear usuario
PUT    /:id             - Actualizar usuario
DELETE /:id             - Eliminar usuario
```

### Productos (/api/products)

```
GET    /                     - Listar productos (público)
GET    /:id                  - Obtener producto (público)
GET    /category/:category   - Por categoría (público)
POST   /                     - Crear (solo admin)
PUT    /:id                  - Actualizar (solo admin)
DELETE /:id                  - Eliminar (solo admin)
```

### Carritos (/api/carts) - Solo User

```
GET    /                     - Ver mi carrito
POST   /products             - Agregar producto
PUT    /products/:productId  - Actualizar cantidad
DELETE /products/:productId  - Eliminar producto
DELETE /                     - Vaciar carrito
POST   /purchase             - Realizar compra
GET    /tickets              - Mis tickets
GET    /tickets/:ticketId    - Ver ticket específico
```

---

## Modelo de Datos Json

### Usuario

```javascript
{
  first_name: String,
  last_name: String,
  email: String (unique),
  age: Number,
  password: String (hashed),
  cart: ObjectId (ref: Cart),
  role: "user" | "admin",
  lastConnection: Date,
  isActive: Boolean
}
```

### Cart

```javascript
{
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number
  }],
  user: ObjectId (ref: User)
}
```

### Ticket

```javascript
{
  code: String (unique),
  purchase_datetime: Date,
  amount: Number,
  purchaser: String (email),
  products: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  status: "completed" | "partial"
}
```

### PasswordReset

```javascript
{
  user: ObjectId (ref: User),
  token: String (unique),
  expiresAt: Date,
  used: Boolean
}
```