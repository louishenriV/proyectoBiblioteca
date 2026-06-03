import { Router } from "express";
import { crearPrestamo, devolverLibro, obtenerPrestamosActivos, obtenerHistorialPrestamos } from "../services/prestamoService.js";
import { Libro } from "../models/Libro.js";

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


app.put("/:id/devolver", async (req, res) => {
    const { id: prestamoId} = req.params;

    try {
        const prestamoDevuelto = await devolverLibro(prestamoId);
        res.json({ mensaje: "Libro devuelto", prestamo: prestamoDevuelto });
    } catch (error:any) {
        res.status(400).json({ error: "Error al devolver el libro: " + error.message });
    }
});


app.get("/activos", async (req, res) => {
    const { id: usuarioId } = req.usuario!; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación

    try {
        const prestamosActivos = await obtenerPrestamosActivos(usuarioId);
        res.json({ prestamos: prestamosActivos });
    } catch (error:any) {
        res.status(400).json({ error: "Error al obtener préstamos activos: " + error.message });
    }
});

app.get("/historial", async (req, res) => {
    const { id: usuarioId } = req.usuario!; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación

    try {
        const historialPrestamos = await obtenerHistorialPrestamos(usuarioId);
        res.json({ prestamos: historialPrestamos });
    } catch (error:any) {
        res.status(400).json({ error: "Error al obtener historial de préstamos: " + error.message });
    }
});

export default app;