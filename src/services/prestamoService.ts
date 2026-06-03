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

export const devolverLibro = async (prestamoId: string) => {
    try {
        const prestamo = await prisma.prestamo.update({
            where: { id: prestamoId },
            data: { fechaDevolucion: new Date() }
        });
        return prestamo;
    } catch (error) {
        throw new Error("Error al devolver el libro");
    }
}; 