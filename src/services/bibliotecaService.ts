import prisma from "../prismaClient.js";
//importamos la instancia de Prisma Client para interactuar con la base de datos


//Obtener todos los libros
export const obtenerLibros = async () => {
    return await prisma.libro.findMany() 
  //conectarse a PostgreSQL, hacer la consulta, esperar la respuesta y traerla de vuelta
};

//agregar un libro
export const agregarLibro = async (data:any) => { //recibe datos desde la API
     const {titulo, autor, anioPublicacion, editorial, edicion, isbn} = data;
    //console.log("data recibida:", data);
    //recibimos los datos del cliente y se extraen con destructuring en un JSON
    
    const nuevoLibro = await prisma.libro.create({
        data: {
            titulo,
            autor,
            anioPublicacion,
            editorial: editorial ?? undefined,
            edicion: edicion ?? undefined,
            isbn: isbn ?? undefined
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
