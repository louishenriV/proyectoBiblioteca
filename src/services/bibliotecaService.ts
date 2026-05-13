
import prisma from "../prismaClient";
//importamos la instancia de Prisma Client para interactuar con la base de datos


//Obtener todos los libros
export const obtenerLibros = async () => {
    return await prisma.libro.findMany();
  //conectarse a PostgreSQL, hacer la consulta, esperar la respuesta y traerla de vuelta
};

//agregar un libro
export const agregarLibro = async (data:any) => { //recibe datos desde la API
    const {titulo, autor, anioPublicacion, prestado} = data;
    //recibimos los datos del cliente y se extraen con destructuring en un JSON
    
    const nuevoLibro = await prisma.libro.create({
        data: {
            titulo,
            autor,
            anioPublicacion,
            prestado: prestado ?? false
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

//actualizar libro 
export const actualizarLibro = async (id: string) => {
    const libroEncontrado = await prisma.libro.findUnique({
        where: { id }
    })
    if (!libroEncontrado) return;
    libroEncontrado.prestado = !libroEncontrado.prestado
    
    await prisma.libro.update({
        where : { id }, 
        data: { prestado: libroEncontrado.prestado }
    })
}