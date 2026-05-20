import "dotenv"
import express from "express"; //Importa el framework para levantar servidores
import librosRoutes from "./routes/libros.js"
import authRoutes from "./routes/auth.js"

const app = express(); //creamos la app donde va a estar nuestro server 
app.use(express.json()) //se trabaja con formato JSON en varios metodos de "BIblioteca"

app.use("/auth", authRoutes) //conectamos las rutas de auth, ahora para acceder a ellas es necesario usar localhost:3000/auth

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