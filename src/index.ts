import { Biblioteca } from "./Biblioteca.js";
import { Libro } from "./models/Libro.js";
import { Comic } from "./models/Comic.js";

// Creamos una nueva biblioteca
const miBiblioteca = new Biblioteca("miBiblioteca");

// Creamos algunos libros y cómics
const libro1 = new Libro("Drácula", "Bram Stoker", 1899, true);
const libro2 = new Libro("Frankenstein", "Mary Shelley", 1818, false);

const comic1 = new Comic("Watchmen", "Alan Moore", 1986, false, "Dave Gibbons");
const comic2 = new Comic("V for Vendetta", "Alan Moore", 1982, true, "David Lloyd");

// Agregamos los libros y cómics a la biblioteca
[libro1, libro2, comic1, comic2].forEach(item => miBiblioteca.agregar(item))


// Mostramos los libros
console.log("=== Todos los libros ===");
miBiblioteca.listar();

console.log("\n=== Libros prestados ===");
miBiblioteca.listarPrestados();

// Buscamos un libro específico
console.log("\n=== Búsqueda ===");
const resultado = miBiblioteca.buscarPorTitulo("Drácula");
console.log(resultado ? resultado.mostrarInfo() : "Libro no encontrado.");
