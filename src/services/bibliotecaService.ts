import { error } from "console";
import { Biblioteca } from "../Biblioteca.js";
import { Libro } from "../models/Libro.js";
import { readFile, writeFile } from "fs/promises"; //leer y escribir archivos de forma async
//ya no depende de la memoria, ahora usamos el almacenamiento

const ruta = "./data/libros.json";//mini BD donde se guardan los datos
const biblioteca = new Biblioteca<Libro>("API Biblioteca");//contenedor en memoria

export const cargarLibros = async () => {
    try{ //lee el archivo libros.json...
        const data = await readFile(ruta, "utf8");//...y espera
        const libros = JSON.parse(data)//convierte el texto en JSON

        biblioteca.coleccion = libros.map((obj: any) =>
            new Libro( //creación de objeto, ya no son JSONs planos
                obj.titulo,
                obj.autor,
                obj.anioPublicacion,
                obj.prestado
            )
        // esto hace que JSON -> objetos simples -> instancias de clase
        );

    }catch(error){ //manejo basico de errores
        console.error("Error cargando libros", error)
    }
};

//Guardar en archivo, convierte el objeto en texto JSON
const guardarLibros = async () => {
    const json = JSON.stringify(biblioteca.coleccion, null, 2);//identacion
    await writeFile(ruta, json, "utf8");//guarda el archivo
};

//Obtener todos los libros
export const obtenerLibros = () => {
    return biblioteca.coleccion; //devuelve los datos en memoria
    /*console.log("coleccion REAL:", biblioteca.coleccion);
    return biblioteca.coleccion;**/
};

//agregar un libro
export const agregarLibro = async (data:any) => { //recibe datos desde la API
    const {titulo, autor, anioPublicacion, prestado} = data;
    //recibimos los datos del cliente y se extraen con destructuring en un JSON
    
    const nuevoLibro = new Libro(titulo, autor, anioPublicacion, prestado);
    biblioteca.agregar(nuevoLibro); //lo agregamos a la colección

    await guardarLibros(); 

    return nuevoLibro;
};

//eliminar un libro
export const eliminarLibro = (id: string): void => {
    biblioteca.eliminar(id)
    guardarLibros()
};

//actualizar libro 
export const actualizarLibro = (id: string): void => {
    biblioteca.actualizar(id)
    guardarLibros()
}