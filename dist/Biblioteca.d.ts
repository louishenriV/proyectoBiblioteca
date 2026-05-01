import { Libro } from "./models/Libro.js";
import { Comic } from "./models/Comic.js";
export declare class Biblioteca<T extends Libro | Comic> {
    nombre: string;
    coleccion: T[];
    constructor(nombre: string);
    agregar(item: T): void;
    listar(): void;
    buscarPorTitulo(titulo: string): T | undefined;
    listarPrestados(): void;
    buscarPor<K extends keyof T>(prop: K, valor: T[K]): T | undefined;
    guardarEnArchivo(ruta: string): Promise<void>;
    cargarDesdeArchivo(ruta: string): Promise<void>;
}
//# sourceMappingURL=Biblioteca.d.ts.map