import { IMostrable } from "../interfaces/IMostrable.js";
import { IPublicacion } from "../interfaces/IPublicacion.js";
export declare class Libro implements IPublicacion, IMostrable {
    titulo: string;
    autor: string;
    anioPublicacion: number;
    prestado: boolean;
    constructor(titulo: string, autor: string, anioPublicacion: number, prestado: boolean);
    mostrarInfo(): string;
}
//# sourceMappingURL=Libro.d.ts.map