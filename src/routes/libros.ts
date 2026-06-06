import { Router } from "express"
import { obtenerLibros, agregarLibro, eliminarLibro, verLibro } from "../services/bibliotecaService.js";
import { checarDisponibilidad } from "../services/prestamoService.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const app = Router()


//obtener todos los libros, ruta /libros 
app.get("/", async(req,res) => { //Endpoint tipico de API
    try{
    res.json(await obtenerLibros())
    } catch (error){
       res.status(500).json({mensaje:"Error al obtener libros", error})  
    }
})
/*Recuerda que ya estamos agregando libros desde el app.use... aqui ya no es 
necesario volverlo a poner en la ruta porque si no sería como pedir la ruta libros/libros */


//crear libro con POST, ruta /libros
app.post("/", adminMiddleware, async (req, res) => {
    // Extraemos los datos del body para validarlos antes de pasarlos al servicio
    const { titulo, autor, anioPublicacion, editorial, edicion, isbn } = req.body;

    if ( // Validamos que cada campo exista y sea del tipo correcto
        typeof titulo !== "string" ||
        typeof autor !== "string" ||
        typeof anioPublicacion !== "number"
    ) {// Si alguno falla, respondemos 400 (Bad Request) y cortamos la ejecución
        res.status(400).json({ mensaje: "Datos inválidos o incompletos" }); 
        return; // evita que Express siga ejecutando código después de haber respondido
    }
    try{
    //creamos un nuevo objeto Libro
    const nuevoLibro = await agregarLibro({titulo, autor, anioPublicacion, editorial, edicion, isbn}) //pasamos el id del usuario al servicio para asociar el libro con el usuario que lo creó   ;
    res.json({mensaje:"Libro agregado", libro: nuevoLibro}) //respuesta   
    } catch (error){
        res.status(500).json({mensaje:"Error al agregar libro", error}) //es importante devolver error 500
    }//si no lo especificamos, devuelve por default 200 y eso es engañoso si se supone es un error

}) 

//checar disponibilidad de un libro con GET, ruta /libros/:id/disponibilidad
app.get("/:id/disponibilidad", async (req, res) => {
    const { id: libroId } = req.params;

    try {
        const disponible = await checarDisponibilidad(libroId);
        res.json({ libroId, disponible });
    } catch (error:any) {
        res.status(400).json({ error: "Error al checar disponibilidad: " + error.message });
    }
}); 


//Eliminar un libro con DELETE
app.delete("/:id", adminMiddleware, async (req, res) => {
    try{
    const id = String(req.params["id"]) //obtenemos el id del libro a eliminar de los parametros de la ruta;
    await eliminarLibro(id) //pasamos el id del usuario al servicio para que solo pueda eliminar libros asociados a ese usuario;
    res.status(200).json({mensaje : "Libro eliminado"})
    } catch (error: any){
        if (error.code === "P2025") {
        res.status(404).json({ mensaje: "Libro no encontrado o no pertenece al usuario" });
        return;
    }
        res.status(500).json({mensaje: "No se pudo borrar el libro, ID no encontrado"})
    }
})


//ver un libro por su ID con GET, ruta /libros/:id
app.get("/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const libro = await verLibro(id);
        if (!libro) {
            res.status(404).json({ mensaje: "Libro no encontrado" });
            return;
        }
        res.json(libro);
    } catch (error: any) {
        res.status(404).json({ mensaje: "Libro no encontrado" });
    }
});


export default app;