# proyectoBiblioteca

API REST para gestión de una biblioteca personal. Permite administrar un acervo de libros, registrar préstamos y gestionar usuarios con autenticación JWT y roles.

## Tecnologías

- TypeScript
- Node.js + Express
- PostgreSQL + Prisma
- JWT + Bcrypt
- Railway (deploy)

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
   npm install
```
3. Configura las variables de entorno en un archivo `.env`:
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/biblioteca
JWT_SECRET="my_secret-key!?!?140294"
PORT=3000

4. Corre las migraciones:
```bash
   npx prisma migrate dev
```
5. Levanta el servidor:
```bash
   npm run dev
```

## Documentación

La documentación interactiva de la API está disponible en:
http://localhost:3000/docs

## Deploy

La API está disponible en producción en Railway:
proyectobiblioteca-production.up.railway.app

## Endpoints principales

### Autenticación
- `POST /auth/registro` — Registrar nuevo usuario
- `POST /auth/login` — Iniciar sesión, devuelve JWT
- `PUT /auth/actualizar` — Actualizar datos del usuario
- `DELETE /auth/eliminar` — Eliminar usuario (solo admin)

### Libros
- `GET /libros` — Ver acervo completo
- `GET /libros/buscar?q=` — Buscar por título o autor
- `GET /libros/:id` — Ver un libro específico
- `GET /libros/:id/disponibilidad` — Verificar disponibilidad
- `POST /libros` — Agregar libro (solo admin)
- `PUT /libros/:id` — Actualizar libro (solo admin)
- `DELETE /libros/:id` — Eliminar libro (solo admin)

### Préstamos
- `POST /prestamos` — Crear préstamo
- `PUT /prestamos/:id/devolver` — Devolver libro
- `GET /prestamos/activos` — Ver préstamos activos
- `GET /prestamos/historial` — Ver historial completo