// 📄 src/main.ts
import { Libro } from "./models/Libro.js";
import { Comic } from "./models/Comic.js";
import { Biblioteca } from "./Biblioteca.js";
import { buscarPorProp } from "./utils/buscarPorProp.js";

const miBiblioteca = new Biblioteca<Libro | Comic>("Central de Quique");
const bibliotecaDeComics = new Biblioteca<Comic>("Comics")
const bibliotecaSoloLibros = new Biblioteca<Libro>("Biblioteca Literaria")

const libro1 = new Libro("Drácula", "Bram Stoker", 1899, true);
const libro2 = new Libro("Frankenstein", "Mary Shelley", 1818, false)
const comic1 = new Comic("Watchmen", "Alan Moore", 1986, false, "Dave Gibbons");

miBiblioteca.agregar(libro1);
miBiblioteca.agregar(libro2)
miBiblioteca.agregar(comic1);

miBiblioteca.listar();
miBiblioteca.listarPrestados();

bibliotecaSoloLibros.agregar(libro1)
/*miBiblioteca.buscarPor("titulo", "Drácula")
miBiblioteca.buscarPor("prestado", true)
miBiblioteca.buscarPor("autor", "Mary Shelley")*/

console.log(miBiblioteca.buscarPor("titulo", "Drácula"));
console.log(buscarPorProp(miBiblioteca.coleccion, "autor", "Alan Moore"))