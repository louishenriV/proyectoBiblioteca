import { Router } from "express";
import bcrypt from "bcrypt";
import { registrarUsuario, loginUsuario, eliminarUsuario} from "../services/authService.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const app = Router(); 
export default app;

const saltRounds = 10; //definimos el número de rondas de sal para bcrypt, esto afecta la seguridad y el tiempo de procesamiento

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
