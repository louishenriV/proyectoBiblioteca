import "dotenv/config"; //Importa la libreria para manejar variables de entorno
import express from "express"; //Importa el framework para levantar servidores
import librosRoutes from "./routes/libros.js"
import authRoutes from "./routes/auth.js"
import prestamosRoutes from "./routes/prestamos.js"
import { authMiddleware } from "./middlewares/auth.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import cors from "cors"; //Importa la libreria para manejar CORS


const app = express(); //creamos la app donde va a estar nuestro server 
app.use(cors({
    origin: ["https://proyecto-biblioteca-zeta.vercel.app",
             "https://proyecto-biblioteca-helybt2zs-quique-and-claude-and-me.vercel.app"],
    credentials: true
})); //Habilita CORS para todas las rutas
app.use(express.json()) //se trabaja con formato JSON en varios metodos de "BIblioteca"
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)) //ruta para la documentacion de la API, se accede con localhost:3000/docs

app.use("/libros",authMiddleware, librosRoutes) /**conectamos las rutas de libros, ahora para acceder 
a ellas es necesario usar localhost:3000/libros 
y ademas se necesita el token de autenticacion**/

app.use("/auth", authRoutes) //conectamos las rutas de auth, ahora para acceder a ellas es necesario usar localhost:3000/auth
app.use("/prestamos", authMiddleware, prestamosRoutes) //conectamos las rutas de prestamos, ahora para acceder a ellas es necesario usar localhost:3000/prestamos y ademas se necesita el token de autenticacion


app.get("/", (req, res) => { //ruta con metodo get y va a escuchar por ese puerto localhost:3000
    res.send("API de Biblioteca funcionando") //si alguien entra, esto es lo que responde
}
);

const PORT = process.env.PORT || 3000; //definimos el puerto, si no esta definido en el .env, se usara el 3000
    app.listen(PORT, () =>{
    console.log("Server listening on localhost:3000")
})

PORT; 
