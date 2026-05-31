import { Router } from "express"
import { obtenerLibros, agregarLibro, eliminarLibro, actualizarLibro } from "../services/bibliotecaService.js";

const app = Router()



//obtener todos los libros, ruta /libros 
app.get("/", async(req,res) => { //Endpoint tipico de API
    const usuarioId = req.usuario?.id; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación
    try{
    res.json(await obtenerLibros(usuarioId)) //pasamos el id del usuario al servicio para que solo traiga los libros asociados a ese usuario
    } catch (error){
       res.status(500).json({mensaje:"Error al obtener libros", error})  
    }
})
/*Recuerda que ya estamos agregando libros desde el app.use... aqui ya no es 
necesario volverlo a poner en la ruta porque si no sería como pedir la ruta libros/libros */



//crear libro con POST, ruta /libros
app.post("/", async (req, res) => {
    // Extraemos los datos del body para validarlos antes de pasarlos al servicio
    const { titulo, autor, anioPublicacion, prestado, editorial, edicion, isbn } = req.body;
    const { id: usuarioId } = req.usuario!; // Obtenemos el ID del usuario autenticado desde el middleware de autenticación

    if ( // Validamos que cada campo exista y sea del tipo correcto
        typeof titulo !== "string" ||
        typeof autor !== "string" ||
        typeof anioPublicacion !== "number" ||
        typeof prestado !== "boolean" ||
        typeof editorial !== "string" ||
        typeof edicion !== "string" ||
        typeof isbn !== "string"
    ) {// Si alguno falla, respondemos 400 (Bad Request) y cortamos la ejecución
        res.status(400).json({ mensaje: "Datos inválidos o incompletos" }); 
        return; // evita que Express siga ejecutando código después de haber respondido
    }
    try{
    //creamos un nuevo objeto Libro
    const nuevoLibro = await agregarLibro({titulo, autor, anioPublicacion, prestado, usuarioId, editorial, edicion, isbn}) //pasamos el id del usuario al servicio para asociar el libro con el usuario que lo creó   ;
    res.json({mensaje:"Libro agregado", libro: nuevoLibro}) //respuesta   
    } catch (error){
        res.status(500).json({mensaje:"Error al agregar libro", error}) //es importante devolver error 500
    }//si no lo especificamos, devuelve por default 200 y eso es engañoso si se supone es un error

}) 

//Eliminar un libro con DELETE
app.delete("/:id", async (req, res) => {
    try{
    const { id } = req.params;
    // console.log("ID recibido:", id);
    await eliminarLibro(id);
    res.status(200).json({mensaje : "Libro eliminado"})
    } catch (error){
        res.status(500).json({mensaje: "No se pudo borrar el libro, ID no encontrado"})
    }

})

//actualizar un libro con PUT
app.put("/:id", async (req, res) =>{
    try{
    const { id } = req.params; 
    await actualizarLibro(id)
    res.status(200).json({mensaje : "Status del libro actualizado"})
    }catch (error){
        res.status(500).json({mensaje: "No se pudo actualizar el status del libro"})
    }
})


export default app;