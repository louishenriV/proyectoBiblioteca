import { IMostrable } from "./interfaces/IMostrable.js";
import { IPublicacion } from "./interfaces/IPublicacion.js";
export declare class Biblioteca<T extends IMostrable & IPublicacion> {
    nombre: string;
    coleccion: T[];
    constructor(nombre: string);
    agregar(item: T): void;
    listar(): void;
    buscarPorTitulo(titulo: string): T | undefined;
    listarPrestados(): void;
    buscarPor<K extends keyof T>(prop: K, valor: T[K]): T | undefined;
}
//# sourceMappingURL=Biblioteca.d.ts.map