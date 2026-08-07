import { Router } from "express";
import { crearPrestamo, devolverLibro, obtenerPrestamosActivos, obtenerHistorialPrestamos} from "../services/prestamoService.js";

const app = Router();

/**
 * @openapi
 * /prestamos:
 *   post:
 *     summary: Crear un nuevo préstamo de libro
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libroId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Préstamo creado exitosamente
 */

//crear nuevo prestamo con POST, ruta /prestamos
app.post("/", async (req, res) => {
    const { id:usuarioId } = req.usuario!; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación
    const { libroId } = req.body;  

    const nuevoPrestamo = await crearPrestamo({ libroId, usuarioId });
    res.status(201).json({ mensaje: "Préstamo creado", prestamo: nuevoPrestamo });
});

/**
 * @openapi
 * /prestamos/{id}/devolver:
 *   put:
 *     summary: Devolver un libro prestado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo a devolver
 *     responses:
 *       200:
 *         description: Libro devuelto exitosamente
 */

//devolver libro con PUT, ruta /prestamos/:id/devolver
app.put("/:id/devolver", async (req, res) => {
    const { id: prestamoId} = req.params;
    const { id: usuarioId } = req.usuario!;

    const prestamoDevuelto = await devolverLibro(prestamoId, usuarioId);
    res.json({ mensaje: "Libro devuelto", prestamo: prestamoDevuelto });
});

/**
 * @openapi
 * /prestamos/activos:
 *   get:
 *     summary: Obtener préstamos activos del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos activos
 */

//obtener prestamos activos del usuario con GET, ruta /prestamos/activos
app.get("/activos", async (req, res) => {
    const { id: usuarioId } = req.usuario!; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación

    const prestamosActivos = await obtenerPrestamosActivos(usuarioId);
    res.json({ prestamos: prestamosActivos });
});

/**
 * @openapi
 * /prestamos/historial:
 *   get:
 *     summary: Obtener historial de préstamos del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos en el historial
 */

app.get("/historial", async (req, res) => {
    const { id: usuarioId } = req.usuario!; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación

    const historialPrestamos = await obtenerHistorialPrestamos(usuarioId);
    res.json({ prestamos: historialPrestamos });
});

export default app;