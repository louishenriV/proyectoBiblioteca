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
}
//# sourceMappingURL=Biblioteca.js.map