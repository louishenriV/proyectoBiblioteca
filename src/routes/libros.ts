import { Router } from "express"
import { obtenerLibros, agregarLibro, eliminarLibro, verLibro, actualizarLibro, buscarLibros } from "../services/bibliotecaService.js";
import { checarDisponibilidad } from "../services/prestamoService.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validarDatosLibro } from "../validators/libroValidator.js";

const app = Router()

/**
 * @openapi
 * /libros:
 *   get:
 *     summary: Obtener los libros del acervo, paginados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pagina
 *         in: query
 *         description: Numero de pagina (empieza en 1)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limite
 *         in: query
 *         description: Cuantos libros traer por pagina (maximo 100)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Pagina de libros, con metadatos de paginacion
 */

//obtener todos los libros, ruta /libros 
app.get("/", async(req,res) => {
    const pagina = Math.max(1, parseInt(req.query.pagina as string) || 1);
    const limite = Math.min(100, Math.max(1, parseInt(req.query.limite as string) || 20));

    const { libros, total } = await obtenerLibros(pagina, limite);
    const totalPaginas = Math.ceil(total / limite);

    res.json({
        libros,
        paginacion: { pagina, limite, total, totalPaginas }
    });
})


/**
 * @openapi
 * /libros:
 *   post:
 *     summary: Agregar un nuevo libro
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               anioPublicacion:
 *                 type: number
 *               editorial:
 *                 type: string
 *               edicion:
 *                 type: string
 *               isbn:
 *                 type: string
 *     responses:
 *       201:
 *         description: Libro agregado exitosamente
 */

//crear libro con POST, ruta /libros
app.post("/", adminMiddleware, async (req, res) => {
    // Extraemos los datos del body para validarlos antes de pasarlos al servicio
    const { titulo, autor, anioPublicacion, editorial, edicion, isbn } = req.body;
 
    const validacion = validarDatosLibro({ titulo, autor, anioPublicacion });
    if (!validacion.valido) {
        res.status(400).json({ mensaje: validacion.mensaje });
        return;
    }
    //creamos un nuevo objeto Libro
    const nuevoLibro = await agregarLibro({titulo, autor, anioPublicacion, editorial, edicion, isbn}) //pasamos el id del usuario al servicio para asociar el libro con el usuario que lo creó   ;
    res.json({mensaje:"Libro agregado", libro: nuevoLibro}) //respuesta   
}) 

/**
 * @openapi
 * /libros/buscar:
 *   get:
 *     summary: Buscar libros por título o autor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         description: Término de búsqueda (título o autor)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 */

app.get("/buscar", async (req, res) => {
    const { q } = req.query; //convencion comun en APIs para indicar el término "query"
    if (!q || typeof q !== "string") { //validamos que el término de búsqueda exista y sea una cadena de texto, si no, respondemos con un error 400 (Bad Request)
        res.status(400).json({ mensaje: "Debes proporcionar un término de búsqueda" });
        return;
    }
    const resultados = await buscarLibros(q);
    res.json(resultados);
});

/**
 * @openapi
 * /libros/{id}/disponibilidad:
 *   get:
 *     summary: Checar disponibilidad de un libro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del libro
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilidad del libro
 */
//checar disponibilidad de un libro con GET, ruta /libros/:id/disponibilidad
app.get("/:id/disponibilidad", async (req, res) => {
    const { id: libroId } = req.params;
 
    const disponible = await checarDisponibilidad(libroId);
    res.json({ libroId, disponible });
}); 

/**
 * @openapi
 * /libros/{id}:
 *   delete:
 *     summary: Eliminar un libro por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del libro a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Libro eliminado exitosamente
 *       404:
 *         description: Libro no encontrado o no pertenece al usuario
 */


//Eliminar un libro con DELETE
app.delete("/:id", adminMiddleware, async (req, res) => {
    const id = String(req.params["id"]) //obtenemos el id del libro a eliminar de los parametros de la ruta;
    await eliminarLibro(id) //pasamos el id del usuario al servicio para que solo pueda eliminar libros asociados a ese usuario;
    res.status(204).json({mensaje : "Libro eliminado"})
})

/**
 * @openapi
 * /libros/{id}:
 *   get:
 *     summary: Ver un libro por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del libro a ver
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del libro
 *       404:
 *         description: Libro no encontrado
 */

//ver un libro por su ID con GET, ruta /libros/:id
app.get("/:id", async (req, res) => {
    const { id } = req.params;
    const libro = await verLibro(id);
    res.json(libro);
});

/**
 * @openapi
 * /libros/{id}:
 *   put:
 *     summary: Actualizar un libro por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID del libro a actualizar
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
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               anioPublicacion:
 *                 type: number
 *               editorial:
 *                 type: string
 *               edicion:
 *                 type: string
 *               isbn:
 *                 type: string
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente
 *       400:
 *         description: No se proporcionaron datos para actualizar
 *       404:
 *         description: Libro no encontrado
 */

app.put("/:id", adminMiddleware, async (req, res) => {
    const id = req.params["id"] as string;
    const data = req.body;

    // Si el body vino vacio o no vino en absoluto (undefined), req.body es {} gracias a express.json(),
    // pero por si acaso llega undefined tambien lo cubrimos aqui.
    if (!data || Object.keys(data).length === 0) {
        res.status(400).json({ mensaje: "No se proporcionaron datos para actualizar" });
        return;
    }

    const libroActualizado = await actualizarLibro(id, data);
    res.json({ mensaje: "Libro actualizado", libro: libroActualizado });
});


export default app;