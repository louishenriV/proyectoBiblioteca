import prisma from "../prismaClient.js";
//importamos la instancia de Prisma Client para interactuar con la base de datos


//Obtener todos los libros
export const obtenerLibros = async () => {
    return await prisma.libro.findMany() 
  //conectarse a PostgreSQL, hacer la consulta, esperar la respuesta y traerla de vuelta
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
    await prisma.libro.delete({
        where: { id }
    })
};


export const verLibro = async (id:string) => {
    try {
    return await prisma.libro.findUnique({ //buscar un libro por su ID
        where: { id }
    }) 
    } catch (error) {
        throw new Error("No se pudo encontrar el libro");
    }
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
    const dataActualizada: any = {};
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
        throw new Error("No se pudo actualizar el libro");
    }
};
                