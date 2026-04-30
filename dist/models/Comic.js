import { Libro } from "./Libro.js";
export class Comic extends Libro {
    constructor(titulo, autor, anioPublicacion, prestado, ilustrador) {
        super(titulo, autor, anioPublicacion, prestado);
        this.ilustrador = ilustrador;
    }
    mostrarInfo() {
        const estado = this.prestado ? "está prestado" : "se encuentra disponible";
        return `El comic "${this.titulo}", escrito por ${this.autor}, ilustrado por ${this.ilustrador} y fue publicado en el año ${this.anioPublicacion}, ${estado}`;
    }
}
/**Eso fuerza a tu clase a tener el método mostrarInfo() correctamente implementado.

✔ No rompe nada
✔ Refuerza tu tipado
✔ Permite que Comic, y cualquier otro tipo, comparta esa estructura */ 
//# sourceMappingURL=Comic.js.map