import { Router } from "express"
import { obtenerLibros, agregarLibro, eliminarLibro, actualizarLibro } from "../services/bibliotecaService.js";

const app = Router()



//obtener todos los libros, ruta /libros 
app.get("/", (req,res) => { //Endpoint tipico de API
    res.json(obtenerLibros()) 
})
/*Recuerda que ya estamos agregando libros desde el app.use... aqui ya no es 
necesario volverlo a poner en la ruta porque si no sería como pedir la ruta libros/libros */



//crear libro con POST, ruta /libros
app.post("/", async (req, res) => {
    
    //creamos un nuevo objeto Libro
    const nuevoLibro = await agregarLibro(req.body);
    res.json({mensaje:"Libro agregado", libro: nuevoLibro}) //respuesta   

}) 

//Eliminar un libro con DELETE
app.delete("/:id", (req, res) => {
    const { id } = req.params;
    console.log("ID recibido:", id);
    eliminarLibro(id);
    res.status(200).json({mensaje : "Libro eliminado"})
    

})

//actualizar un libro con PUT
app.put("/:id", (req, res) =>{
    const { id } = req.params; 
    actualizarLibro(id)
    res.status(200).json({mensaje : "Status del libro actualizado"})
})


export default app;