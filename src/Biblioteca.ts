import { Libro } from "./models/Libro.js"
import { Comic } from "./models/Comic.js";
import { IMostrable } from "./interfaces/IMostrable.js";
import { IPublicacion } from "./interfaces/IPublicacion.js";
import { writeFile, readFile } from "fs/promises"

export class Biblioteca<T extends Libro | Comic>{
    nombre: string;
    coleccion: T[] = [];

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    // Agrega un libro o cómic a la colección
    agregar(item: T): void {
        this.coleccion.push(item);
        console.log(`📚 Se agregó "${item.titulo}" a la biblioteca "${this.nombre}".`);
    }

    eliminar(id: string): void{
        this.coleccion = this.coleccion.filter((item) => item.id !== id); 
    } //"nos regresa los que son diferentes al que queremos borrar, desigualdad estricta "

    // Lista todos los libros y cómics en la colección
    listar(): void {
        console.log(`\n📖 Catálogo de "${this.nombre}":`);
        if (this.coleccion.length === 0) {
            console.log("No hay libros registrados todavía.");
        } else {
            this.coleccion.forEach((item) => {
                console.log("• " + item.mostrarInfo());
            });
        }
    }

    actualizar(id: string): void {
        const libroEncontrado = this.coleccion.find((item) => item.id === id)
        if (!libroEncontrado) return ;
        libroEncontrado.prestado = !libroEncontrado.prestado
        
        
    }

    // Busca un libro por título
    buscarPorTitulo(titulo: string): T| undefined {
        return this.coleccion.find(
            (item) => item.titulo.toLowerCase() === titulo.toLowerCase()
        );
    }

    // Muestra solo los libros prestados
    listarPrestados(): void {
        console.log(`\n📕 Libros prestados en "${this.nombre}":`);
        const prestados = this.coleccion.filter((item) => item.prestado);
        if (prestados.length === 0) {
            console.log("No hay libros prestados actualmente.");
        } else {
            prestados.forEach((item) => {
                console.log("• " + item.mostrarInfo());
            });
        }
    
    }
    //metodos genericos internos
    buscarPor<K extends keyof T>(prop: K, valor: T[K]): T | undefined {
        return this.coleccion.find(item => item[prop] === valor);
    }

        // Guarda toda la colección en un archivo JSON
    async guardarEnArchivo(ruta: string): Promise<void> {
        try {
            const json = JSON.stringify(this.coleccion, null, 2); // formateado
            await writeFile(ruta, json, "utf8");
            console.log(`💾 Biblioteca guardada en ${ruta}`);
        } catch (error) {
            console.error("❌ Error al guardar archivo:", error);
        }
    }

    // Carga la colección desde un archivo JSON
    async cargarDesdeArchivo(ruta: string): Promise<void> {
        try {
            const data = await readFile(ruta, "utf8");
            const objetos = JSON.parse(data);

            this.coleccion = objetos.map((obj: any) => {
                // Detectar si es Comic (tiene ilustrador)
                if ("ilustrador" in obj) {
                    return new Comic(
                        obj.titulo,
                        obj.autor,
                        obj.anioPublicacion,
                        obj.prestado,
                        obj.ilustrador
                    ) as T;
                } 
                // Si no es Comic, es Libro
                return new Libro(
                    obj.titulo,
                    obj.autor,
                    obj.anioPublicacion,
                    obj.prestado
                ) as T;
            });

            console.log(`📥 Biblioteca cargada desde ${ruta}`);
        } catch (error) {
            console.error("❌ Error al cargar archivo:", error);
        }
    }

    
}

