import { Router } from "express"
import { obtenerLibros, agregarLibro } from "../services/bibliotecaService.js";

const app = Router()



//obtener todos los libros, ruta /libros 
app.get("/", (req,res) => { //Endpoint tipico de API
    res.json(obtenerLibros) 
})
/*Recuerda que ya estamos agregando libros desde el app.use... aqui ya no es 
necesario volverlo a poner en la ruta porque si no sería como pedir la ruta libros/libros */



//crear libro con POST, ruta /libros
app.post("/", async (req, res) => {
    
    //creamos un nuevo objeto Libro
    const nuevoLibro = await agregarLibro(req.body);
    res.json({mensaje:"Libro agregado", libro: nuevoLibro}) //respuesta   

}) 
export default app;