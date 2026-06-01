import { Router } from "express";
import { crearPrestamo } from "../services/prestamoService.js";

const app = Router();

app.post("/", async (req, res) => {
    const { id:usuarioId } = req.usuario!; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación
    const { libroId } = req.body;  

    try {
        const nuevoPrestamo = await crearPrestamo({ libroId, usuarioId });
        res.status(201).json({ mensaje: "Préstamo creado", prestamo: nuevoPrestamo });
    } catch (error:any) {
        res.status(400).json({ error: "Error al crear el préstamo: " + error.message });
    }
});

export default app;