import { IMostrable } from "../interfaces/IMostrable.js";
import { IPublicacion } from "../interfaces/IPublicacion.js";
import { Libro } from "./Libro.js";
export declare class Comic extends Libro implements IPublicacion, IMostrable {
    ilustrador: string;
    constructor(titulo: string, autor: string, anioPublicacion: number, prestado: boolean, ilustrador: string);
    mostrarInfo(): string;
}
/**Eso fuerza a tu clase a tener el método mostrarInfo() correctamente implementado.

✔ No rompe nada
✔ Refuerza tu tipado
✔ Permite que Comic, y cualquier otro tipo, comparta esa estructura */ 
//# sourceMappingURL=Comic.d.ts.map