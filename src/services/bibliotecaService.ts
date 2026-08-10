import prisma from "../prismaClient.js";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../errors/AppError.js";
//importamos la instancia de Prisma Client para interactuar con la base de datos


//Include compartido: cualquier endpoint que devuelva libros al frontend debe usar
//este mismo include, asi la forma del dato "Libro" nunca se desincroniza entre funciones
//(el frontend siempre espera libro.prestamos, aunque sea un arreglo vacio)
const INCLUDE_PRESTAMOS_ACTIVOS = {
    prestamos: {
        where: { fechaDevolucion: null } //si fechaDevolucion es null, significa que el libro está prestado, si no es null, significa que el libro está disponible
    }
};

//Obtener todos los libros
export const obtenerLibros = async () => {
    return await prisma.libro.findMany({
        include: INCLUDE_PRESTAMOS_ACTIVOS
    }) 
};

//definir LibroData para tipar los datos que se reciben al agregar un libro
type LibroData = {
    titulo: string;
    autor: string;
    anioPublicacion: number;
    editorial?: string; 
    edicion?: string;
    isbn?: string; 
};

//agregar un libro
export const agregarLibro = async (data: LibroData) => { //recibe datos desde la API
     const {titulo, autor, anioPublicacion, editorial, edicion, isbn} = data;
    //recibimos los datos del cliente y se extraen con destructuring en un JSON
    
    const nuevoLibro = await prisma.libro.create({
        data: {
            titulo,
            autor,
            anioPublicacion,
            editorial: editorial ?? null,
            edicion: edicion ?? null,
            isbn: isbn ?? null
        }
    })

    return nuevoLibro;
};

//eliminar un libro
export const eliminarLibro = async (id:string) => {
    try {
        await prisma.libro.delete({
            where: { id }
        });
    } catch (error) {
        // P2025: codigo especifico de Prisma para "el registro que querias
        // borrar/actualizar no existe". Lo distinguimos de cualquier otro
        // error inesperado (conexion caida, etc.) para no disfrazar ese
        // segundo caso como un simple 404.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new AppError("Libro no encontrado o no pertenece al usuario", 404);
        }
        throw error; // error inesperado: sube tal cual hasta el middleware central (500)
    }
};

export const verLibro = async (id:string) => {
    const libro = await prisma.libro.findUnique({ //buscar un libro por su ID
        where: { id }
    });
    if (!libro) {
        throw new AppError("Libro no encontrado", 404);
    }
    return libro;
}


type actualizarLibroData = {
    titulo?: string;
    autor?: string;
    anioPublicacion?: number;
    editorial?: string; 
    edicion?: string;
    isbn?: string; 
};

//actualizar un libro
export const actualizarLibro = async (id:string, data: actualizarLibroData) => {
    const dataActualizada: Partial<actualizarLibroData> = {}; //creamos un objeto vacío para almacenar sólo los campos que se proporcionan en el objeto data, esto permite actualizaciones parciales sin sobrescribir campos no proporcionados
    if (data.titulo) dataActualizada.titulo = data.titulo; //sólo agregamos al objeto dataActualizada las propiedades que se proporcionan en el objeto data, esto permite actualizaciones parciales sin sobrescribir campos no proporcionados
    if (data.autor) dataActualizada.autor = data.autor;
    if (data.anioPublicacion) dataActualizada.anioPublicacion = data.anioPublicacion;
    if (data.editorial !== undefined) dataActualizada.editorial = data.editorial ?? null; //si editorial se proporciona como null, se establece como null, si no se proporciona, se deja como undefined para que Prisma no lo actualice
    if (data.edicion !== undefined) dataActualizada.edicion = data.edicion ?? null; 
    if (data.isbn !== undefined) dataActualizada.isbn = data.isbn ?? null;
    try {
        const libroActualizado = await prisma.libro.update({ //prisma recibe y actualiza sólo los campor proporcionados
            where: { id },
            data: dataActualizada
        });
        return libroActualizado;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            throw new AppError("Libro no encontrado", 404);
        }
        throw error;
    }
};


export const buscarLibros = async (query: string) => {
    return await prisma.libro.findMany({
        where: {
            OR: [
                { titulo: { contains: query, mode: "insensitive" } }, //verifica si la consulta está contenida en el título, autor o año de publicación, sin importar mayúsculas o minúsculas
                { autor: { contains: query, mode: "insensitive" } }
            ]
        },
            include: INCLUDE_PRESTAMOS_ACTIVOS
    });
}
                