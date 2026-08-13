import { Router } from "express";
import bcrypt from "bcrypt";
import { registrarUsuario, loginUsuario, eliminarUsuario, actualizarDatos, listarUsuarios, actualizarUsuarioComoAdmin} from "../services/authService.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const app = Router(); 
export default app;

const saltRounds = 10; //definimos el número de rondas de sal para bcrypt, esto afecta la seguridad y el tiempo de procesamiento

/**
 * @openapi
 * /auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */

//Crear usuario con POST, ruta /auth/registro
app.post("/registro", async (req, res) => {
    const { nombre, email, password } = req.body;

    if (typeof nombre !== "string" || typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
        return;
    }

    if (password.length < 8) {
        res.status(400).json({ mensaje: "La contraseña debe tener al menos 8 caracteres" });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,3}$/; // Expresión regular para validar el formato del email
    if (!emailRegex.test(email)) {
        res.status(400).json({ mensaje: "Formato de email inválido" });
        return;
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const nuevoUsuario = await registrarUsuario({nombre, email, password: hash});
    res.status(201).json({ mensaje: "Usuario registrado", usuario: nuevoUsuario });
})


/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve un token JWT
 */

//Login de usuario con POST, ruta /auth/login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
        return;
    }
    const token = await loginUsuario(email, password);
    if (!token) {
        res.status(401).json({ mensaje: "Credenciales incorrectas" });
        return;
    }
    res.json({ mensaje: "Login exitoso", token });
})

/**
 * @openapi
 * /auth/eliminar:
 *   delete:
 *     summary: Eliminar un usuario (solo admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 */

//eliminar usuario con DELETE, ruta /auth/eliminar
app.delete("/eliminar", authMiddleware, adminMiddleware, async (req, res) => {
    const { email } = req.body;
    if (typeof email !== "string") {
        res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
        return;
    }
    await eliminarUsuario(email);
    res.json({ mensaje: "Usuario eliminado" });
})

/**
 * @openapi
 * /auth/actualizar:
 *   put:
 *     summary: Actualizar nombre y email de un usuario (solo el propio usuario o admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos actualizados exitosamente
 */

//actualizar nombre e email del usuario con PUT, ruta /auth/actualizar
app.put("/actualizar", authMiddleware, async (req, res) => {
    const { id } = req.usuario!; //obtenemos el id del usuario autenticado desde el middleware
    const datosActualizados = await actualizarDatos(id, req.body);
    res.json({ mensaje: "Datos actualizados", usuario: datosActualizados });
})

/**
 * @openapi
 * /auth/usuarios:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios registrados
 */
 
//listar usuarios con GET, ruta /auth/usuarios (solo admin)
app.get("/usuarios", authMiddleware, adminMiddleware, async (req, res) => {
    const usuarios = await listarUsuarios();
    res.json({ usuarios });
})
 
/**
 * @openapi
 * /auth/usuarios/{id}:
 *   put:
 *     summary: Actualizar nombre, email y/o rol de un usuario (solo admin)
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del usuario a actualizar
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Solo incluye los campos que quieras actualizar
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [admin, user]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos invalidos, o un admin intentando cambiar su propio rol
 *       404:
 *         description: Usuario no encontrado
 */
 
//actualizar usuario (incluyendo rol) con PUT, ruta /auth/usuarios/:id (solo admin)
app.put("/usuarios/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { id: idAdmin } = req.usuario!;
    const { nombre, email, rol } = req.body;
 
    // Un admin no puede cambiar su propio rol por esta ruta, para evitar que
    // se quede accidentalmente sin permisos de admin sin forma de revertirlo
    if (rol !== undefined && id === idAdmin) {
        res.status(400).json({ mensaje: "No puedes cambiar tu propio rol desde esta ruta" });
        return;
    }
 
    const usuarioActualizado = await actualizarUsuarioComoAdmin(id as string, { nombre, email, rol });
    res.json({ mensaje: "Usuario actualizado", usuario: usuarioActualizado });
})