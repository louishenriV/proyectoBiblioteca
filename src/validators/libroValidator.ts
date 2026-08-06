//Funcion pura: no depende de Express (req/res) ni de Prisma (base de datos).
//Solo recibe datos y regresa si son validos, para poder probarla de forma
//aislada y rapida con tests, sin necesidad de levantar un servidor ni una DB.

export type DatosLibro = {
    titulo: unknown;
    autor: unknown;
    anioPublicacion: unknown;
};

export type ResultadoValidacion = {
    valido: boolean;
    mensaje?: string;
};

export function validarDatosLibro(datos: DatosLibro): ResultadoValidacion {
    const { titulo, autor, anioPublicacion } = datos;

    const tituloValido = typeof titulo === "string" && titulo.trim() !== "";
    const autorValido = typeof autor === "string" && autor.trim() !== "";
    const anioValido = typeof anioPublicacion === "number";

    if (!tituloValido || !autorValido || !anioValido) {
        return { valido: false, mensaje: "Datos inválidos o incompletos" };
    }

    return { valido: true };
}