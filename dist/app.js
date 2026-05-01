import express from "express"; //Importa el framwork para levantar servidores
import { Biblioteca } from "./Biblioteca"; //toda la logica
import { Libro } from "./models/Libro"; //el molde para mis objetos
const app = express(); //creamos la app donde va a estar nuestro server 
app.use(express.json()); //se trabaja con formato JSON en varios metodos de "BIblioteca"
const biblioteca = new Biblioteca("API biblioteca"); //base de datos en memoria
app.get("/", (req, res) => {
    res.send("API de Biblioteca funcionando"); //si alguien entra, esto es lo que responde
});
//obtener todos los libros 
app.get("/libros", (req, res) => {
    res.json(biblioteca.coleccion);
});
//crear libro con POST
app.post("/libros", (req, res) => {
    const { titulo, autor, anioPublicacion, prestado } = req.body;
    //recibimos los datos del cliente y se extraen con destructuring en un JSON
    //creamos un nuevo objeto Libro
    const nuevoLibro = new Libro("México ante Dios", "Francisco Martin Moreno", 2007, false);
    biblioteca.agregar(nuevoLibro); //lo agregamos a la colección
    res.json({ mensaje: "Libro agregado", libro: nuevoLibro }); //respuesta   
});
//# sourceMappingURL=app.js.map