import "dotenv/config"; //Importa la libreria para manejar variables de entorno
import express from "express"; //Importa el framework para levantar servidores
import librosRoutes from "./routes/libros.js"
import authRoutes from "./routes/auth.js"
import prestamosRoutes from "./routes/prestamos.js"
import { authMiddleware } from "./middlewares/auth.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import cors from "cors"; //Importa la libreria para manejar CORS
import { Request, Response, NextFunction } from "express"; //Importa los tipos de Request y Response de Express
import { AppError } from "./errors/AppError.js"; //Importa la clase de error personalizada


const app = express(); //creamos la app donde va a estar nuestro server 

//Lista de origenes permitidos: el regex de produccion (Vercel) siempre esta,
//y el origen de desarrollo local se agrega solo si esta definido en el .env,
//asi el codigo que se sube a produccion nunca tiene un localhost harcodeado
const allowedOrigins: (string | RegExp)[] = [/\.vercel\.app$/];

if (process.env.CORS_ORIGIN_DEV) {
    allowedOrigins.push(process.env.CORS_ORIGIN_DEV);
}

app.use(cors({
    origin: allowedOrigins,
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

//Middleware central de manejo de errores. Debe ir DESPUES de todas las rutas
//para que Express sepa que es aqui donde caen los errores, y necesita
//exactamente 4 parametros (err, req, res, next) para que Express lo
//reconozca como middleware de errores y no como una ruta normal.
//
//Gracias a Express 5, si una ruta async hace throw de un error, Express
//lo atrapa solo y lo manda derechito aqui - no hace falta try/catch
//ni next(error) manual en cada ruta.
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ mensaje: err.message });
        return;
    }

    //Error inesperado, no previsto por ninguna ruta o service.
    //Lo registramos en consola para poder diagnosticarlo despues,
    //pero nunca exponemos el detalle interno al usuario.
    console.error(err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000; //definimos el puerto, si no esta definido en el .env, se usara el 3000
    app.listen(PORT, () =>{
    console.log("Server listening on localhost:3000")
})

PORT; 
