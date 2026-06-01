import prisma from "../prismaClient.js";

//crear prestamo
export const crearPrestamo = async (data:any) => {
    const { libroId, usuarioId } = data;
    try {
    const nuevoPrestamo = await prisma.prestamo.create({
        data: {
            libroId,
            usuarioId, 
            fechaPrestamo: new Date()
  }  
})
return nuevoPrestamo;
} catch (error) {
    throw new Error("Error al crear el préstamo");
}
};