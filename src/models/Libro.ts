import { IMostrable } from "../interfaces/IMostrable.js"
import { IPublicacion } from "../interfaces/IPublicacion.js"

export class Libro implements IPublicacion, IMostrable{
    id: string
    titulo: string 
    autor: string
    anioPublicacion: number
    prestado: boolean = false

    constructor(titulo: string, autor: string, anioPublicacion: number, prestado: boolean){
        this.id = crypto.randomUUID()
        this.titulo = titulo
        this.autor = autor
        this.anioPublicacion = anioPublicacion
        this.prestado = prestado
    }

    mostrarInfo(): string{
    const estado = this.prestado ? "está prestado" : "se encuentra disponible";
    return `El libro ${this.titulo}, escrito por ${this.autor} y fue publicado en el año ${this.anioPublicacion}, ${estado}.`;
    }
}