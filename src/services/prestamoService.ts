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

export const obtenerHistorialPrestamos = async (usuarioId: string, pagina: number, limite: number) => { //página indica en qué página estamos, y limite indica cuántos prestamos queremos por página
    const skip = (pagina - 1) * limite; //cuántos registros altar para llegar  la o página que queremos. 
    //por ejemplo, si estamos en la página 2 y el límite es 10, entonces skip = (2-1)*10 = 10, es decir, saltamos los primeros 10 registros para llegar a la página 2.
    const filtro = { usuarioId };
    //se va a utilizar dos vees esta variable, una para obtener los prestamos y otra para obtener el total de prestamos, por eso se hace en paralelo con Promise.all

    const [prestamos, total] = await Promise.all([ //promise.all le pide dos cosas a la vez a la base de datos, y espera a que ambas terminen para devolver un array con los resultados. 
        prisma.prestamo.findMany({
            where: filtro,
            include: {
                usuario: { select: { id: true, nombre: true, email: true } },
                libro: true
            },
            orderBy: { fechaPrestamo: "desc" }, // el prestamo mas reciente primero, tiene mas sentido para un historial
            skip,
            take: limite
        }),
        prisma.prestamo.count({ where: filtro })
    ]);

    return { prestamos, total };
};

export const checarDisponibilidad = async (libroId: string) => {
    const prestamoActivo = await prisma.prestamo.findFirst({
        where: { libroId, fechaDevolucion: null }
    });
    return !prestamoActivo; // !prestamoActivo = false. Si no hay un préstamo activo, el libro está disponible

};