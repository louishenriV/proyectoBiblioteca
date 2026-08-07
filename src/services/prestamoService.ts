import { AppError } from "../errors/AppError.js";
import prisma from "../prismaClient.js";

//definir PrestamoData para tipar los datos que se reciben al crear un préstamo
type PrestamoData = {
    libroId: string;
    usuarioId: string;
};

//crear prestamo
//crear prestamo
export const crearPrestamo = async (data: PrestamoData) => {
    const { libroId, usuarioId } = data;

    const existeLibro = await prisma.libro.findUnique({ where: { id: libroId } });
    if (!existeLibro) {
        throw new AppError("El libro no existe", 404);
    }

    const prestamoActivo = await prisma.prestamo.findFirst({
        where: { libroId, fechaDevolucion: null }
    });

    if (prestamoActivo) {
        throw new AppError("El libro ya está prestado", 409);
    }

    const nuevoPrestamo = await prisma.prestamo.create({
        data: {
            libroId,
            usuarioId,
            fechaPrestamo: new Date()
        }
    });

    return nuevoPrestamo;
};

export const devolverLibro = async (prestamoId: string, usuarioId: string) => {
        const prestamoExistente = await prisma.prestamo.findUnique({
            where: { id: prestamoId }
        });
        if (!prestamoExistente) {
            throw new AppError("El préstamo no existe", 404);
        }
        if (prestamoExistente.usuarioId !== usuarioId) {
            throw new AppError("No tienes permiso para devolver este libro", 403);
        }
        const prestamo = await prisma.prestamo.update({
            where: { id: prestamoId, usuarioId }, // Aseguramos que el préstamo pertenece al usuario que lo está devolviendo
            data: { fechaDevolucion: new Date() }
        });
        return prestamo;
}; 

export const obtenerPrestamosActivos = async (usuarioId: string) => { //filtrar prestamos activos por usuario, si no, devuelve todos los prestamos activos de todos los usuarios, lo cual no es lo ideal
    return await prisma.prestamo.findMany({ //con findMany, podemos filtrar por fecha de devolución nula y por usuarioId
        where: { fechaDevolucion: null, usuarioId },
        include: {
            usuario: { select: { id: true, nombre: true, email: true } }, //nos aseguramos de no incluir el password del usuario en la respuesta, por seguridad
            libro: true
        }
    });
};

export const obtenerHistorialPrestamos = async (usuarioId: string) => {
    return await prisma.prestamo.findMany({
        where: { usuarioId },
        include: {
            usuario: { select: { id: true, nombre: true, email: true } },
            libro: true
        }
    });
};

export const checarDisponibilidad = async (libroId: string) => {
    const prestamoActivo = await prisma.prestamo.findFirst({
        where: { libroId, fechaDevolucion: null }
    });
    return !prestamoActivo; // !prestamoActivo = false. Si no hay un préstamo activo, el libro está disponible

};