import "dotenv"
import express from "express"; //Importa el framwork para levantar servidores
import librosRoutes from "./routes/libros.js"

const app = express(); //creamos la app donde va a estar nuestro server 
app.use(express.json()) //se trabaja con formato JSON en varios metodos de "BIblioteca"

//aqui conectamos las rutas
app.use("/libros", librosRoutes)


app.get("/", (req, res) => { //ruta con metodo get y va a escuchar por ese puerto localhost:3000
    res.send("API de Biblioteca funcionando") //si alguien entra, esto es lo que responde
}
);

const start = () => {
    app.listen(3000, () =>{
    console.log("Server listening on localhost:3000")
})
};

start();