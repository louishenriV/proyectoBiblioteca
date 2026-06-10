import { Router } from "express";
import bcrypt from "bcrypt";
import { registrarUsuario, loginUsuario, eliminarUsuario, actualizarDatos} from "../services/authService.js";
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato del email
    if (!emailRegex.test(email)) {
        res.status(400).json({ mensaje: "Formato de email inválido" });
        return;
    }


    try{
    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await registrarUsuario({nombre, email, password: hash});
    res.status(201).json({ mensaje: "Usuario registrado", usuario: nuevoUsuario });
    }     catch (error: any) {
            console.log("Error en login:", error);
            if (error.code === "P2002") {
                res.status(409).json({ mensaje: "El email ya está registrado" });
                return;
            }
            res.status(500).json({ mensaje: "Error al registrar usuario", error });
    }
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
        try {
            const token = await loginUsuario(email, password);
            if (!token) {
                res.status(401).json({ mensaje: "Credenciales incorrectas" });
                return;
            }
            res.json({ mensaje: "Login exitoso", token });
        }
        catch (error) {
            res.status(500).json({ mensaje: "Error al iniciar sesión", error });
        }
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
    try {
        await eliminarUsuario(email);
        res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar usuario", error });
    }   
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
    try {
    const { id } = req.usuario!; //obtenemos el id del usuario autenticado desde el middleware
     const datosActualizados = await actualizarDatos(id, req.body);
     res.json({ mensaje: "Datos actualizados", usuario: datosActualizados });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar datos", error });
    }
})
