export class Libro {
    constructor(titulo, autor, anioPublicacion, prestado) {
        this.prestado = false;
        this.titulo = titulo;
        this.autor = autor;
        this.anioPublicacion = anioPublicacion;
        this.prestado = prestado;
    }
    mostrarInfo() {
        const estado = this.prestado ? "está prestado" : "se encuentra disponible";
        return `El libro ${this.titulo}, escrito por ${this.autor} y fue publicado en el año ${this.anioPublicacion}, ${estado}.`;
    }
}
//# sourceMappingURL=Libro.js.map