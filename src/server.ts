import app from "./app.js"; //importamos la app desde el archivo app.ts

const PORT = process.env.PORT || 3000; //definimos el puerto, si no esta definido en el .env, se usara el 3000
    app.listen(PORT, () =>{
    console.log("Server listening on localhost:3000")
})

PORT; 