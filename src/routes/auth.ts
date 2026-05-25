import { Router } from "express";
import bcrypt from "bcrypt";
import { registrarUsuario, loginUsuario} from "../services/authService.js";

const app = Router(); 
export default app;

const saltRounds = 10; //definimos el número de rondas de sal para bcrypt, esto afecta la seguridad y el tiempo de procesamiento

app.post("/registro", async (req, res) => {
    const { nombre, email, password } = req.body;

    if (typeof nombre !== "string" || typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ mensaje: "Datos inválidos o incompletos" });
        return;
    }
    try{
    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await registrarUsuario({nombre, email, password: hash});
    res.status(201).json({ mensaje: "Usuario registrado", usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar usuario", error });
    }
})

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
        } catch (error) {
            res.status(500).json({ mensaje: "Error al iniciar sesión", error });
        }
})

