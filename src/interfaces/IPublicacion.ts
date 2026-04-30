//Vamos a capturar las propiedades que comparten Libro y Comic:
export interface IPublicacion {
    titulo: string;
    autor: string;
    anioPublicacion: number;
    prestado: boolean;
}
