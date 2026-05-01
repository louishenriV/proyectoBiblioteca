import { Router } from "express"
import { Biblioteca } from "../Biblioteca.js"
import { Libro } from "../models/Libro.js"

const app = Router()

const biblioteca = new Biblioteca<Libro>("API Bibliteca")

//obtener todos los libros, ruta /libros 
app.get("/", (req,res) => { //Endpoint tipico de API
    res.json(biblioteca.coleccion) 
})
/*Recuerda que ya estamos agregando libros desde el app.use... aqui ya no es 
necesario volverlo a poner en la ruta porque si no sería como pedir la ruta libros/libros */



//crear libro con POST, ruta /libros
app.post("/", (req, res) => {
    const {titulo, autor, anioPublicacion, prestado} = req.body
    //recibimos los datos del cliente y se extraen con destructuring en un JSON


    //creamos un nuevo objeto Libro
    const nuevoLibro = new Libro(titulo, autor, anioPublicacion, prestado);
    biblioteca.agregar(nuevoLibro);//lo agregamos a la colección
    
    res.json({mensaje:"Libro agregado", libro: nuevoLibro}) //respuesta   

}) 
export default app;