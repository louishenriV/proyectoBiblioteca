import { Libro } from "./models/Libro.js";
import { Comic } from "./models/Comic.js";
import { writeFile, readFile } from "fs/promises";
export class Biblioteca {
    constructor(nombre) {
        this.coleccion = [];
        this.nombre = nombre;
    }
    // Agrega un libro o cómic a la colección
    agregar(item) {
        this.coleccion.push(item);
        console.log(`📚 Se agregó "${item.titulo}" a la biblioteca "${this.nombre}".`);
    }
    // Lista todos los libros y cómics en la colección
    listar() {
        console.log(`\n📖 Catálogo de "${this.nombre}":`);
        if (this.coleccion.length === 0) {
            console.log("No hay libros registrados todavía.");
        }
        else {
            this.coleccion.forEach((item) => {
                console.log("• " + item.mostrarInfo());
            });
        }
    }
    // Busca un libro por título
    buscarPorTitulo(titulo) {
        return this.coleccion.find((item) => item.titulo.toLowerCase() === titulo.toLowerCase());
    }
    // Muestra solo los libros prestados
    listarPrestados() {
        console.log(`\n📕 Libros prestados en "${this.nombre}":`);
        const prestados = this.coleccion.filter((item) => item.prestado);
        if (prestados.length === 0) {
            console.log("No hay libros prestados actualmente.");
        }
        else {
            prestados.forEach((item) => {
                console.log("• " + item.mostrarInfo());
            });
        }
    }
    //metodos genericos internos
    buscarPor(prop, valor) {
        return this.coleccion.find(item => item[prop] === valor);
    }
    // Guarda toda la colección en un archivo JSON
    async guardarEnArchivo(ruta) {
        try {
            const json = JSON.stringify(this.coleccion, null, 2); // formateado
            await writeFile(ruta, json, "utf8");
            console.log(`💾 Biblioteca guardada en ${ruta}`);
        }
        catch (error) {
            console.error("❌ Error al guardar archivo:", error);
        }
    }
    // Carga la colección desde un archivo JSON
    async cargarDesdeArchivo(ruta) {
        try {
            const data = await readFile(ruta, "utf8");
            const objetos = JSON.parse(data);
            this.coleccion = objetos.map((obj) => {
                // Detectar si es Comic (tiene ilustrador)
                if ("ilustrador" in obj) {
                    return new Comic(obj.titulo, obj.autor, obj.anioPublicacion, obj.prestado, obj.ilustrador);
                }
                // Si no es Comic, es Libro
                return new Libro(obj.titulo, obj.autor, obj.anioPublicacion, obj.prestado);
            });
            console.log(`📥 Biblioteca cargada desde ${ruta}`);
        }
        catch (error) {
            console.error("❌ Error al cargar archivo:", error);
        }
    }
}
//# sourceMappingURL=Biblioteca.js.map