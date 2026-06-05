import prisma from "../prismaClient.js";

//definir PrestamoData para tipar los datos que se reciben al crear un préstamo
type PrestamoData = {
    libroId: string;
    usuarioId: string;
};

//crear prestamo
export const crearPrestamo = async (data: PrestamoData) => {
    
    const { libroId, usuarioId } = data;
      const prestamoActivo = await prisma.prestamo.findFirst({
        where: { libroId, fechaDevolucion: null }
    });

    if (prestamoActivo) {
        throw new Error("El libro ya está prestado");
    }

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

export const obtenerPrestamosActivos = async (usuarioId: string) => { //filtrar prestamos activos por usuario, si no, devuelve todos los prestamos activos de todos los usuarios, lo cual no es lo ideal
    return await prisma.prestamo.findMany({ //con findMany, podemos filtrar por fecha de devolución nula y por usuarioId
        where: { fechaDevolucion: null, usuarioId },
        include: {
            usuario: { select: { id: true, nombre: true, email: true } } //nos aseguramos de no incluir el password del usuario en la respuesta, por seguridad
        }
    });
};

export const obtenerHistorialPrestamos = async (usuarioId: string) => {
    return await prisma.prestamo.findMany({
        where: { usuarioId },
        include: {
            usuario: { select: { id: true, nombre: true, email: true } }
        }
    });
};

export const checarDisponibilidad = async (libroId: string) => {
    try {
    const prestamoActivo = await prisma.prestamo.findFirst({
        where: { libroId, fechaDevolucion: null }
    });
    return !prestamoActivo; // !prestamoActivo = false. Si no hay un préstamo activo, el libro está disponible
} catch (error) {
    throw new Error("Error al verificar disponibilidad del libro");
}
};