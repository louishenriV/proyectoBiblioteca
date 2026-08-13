import prisma from "../prismaClient.js";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../errors/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


type UsuarioData = {
    nombre: string;
    email: string;
    password: string;
};

export const registrarUsuario = async (data:UsuarioData) => {
    const { nombre, email, password } = data;
    try {
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password
            }, 
            select: {
                id: true,
                nombre: true,
                email: true
            } 
        })
        return nuevoUsuario;
    } catch (error) {
        // P2002: codigo especifico de Prisma para "violacion de restriccion unique"
        // (en este caso, el email ya esta registrado por otro usuario)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new AppError("El email ya está registrado", 409); // 409 Conflict
        }
        throw error;
    }
}; 

export const loginUsuario = async (email:string, password:string) => {
    const usuarioEncontrado = await prisma.usuario.findUnique({
        where: { email }
    })

    if (!usuarioEncontrado) return null;

    const match = await bcrypt.compare(password, usuarioEncontrado!.password); //usuarioEncontrado! se usa para indicar que estamos seguros de que no es null, ya que si fuera null, el código no llegaría a esta línea debido al return anterior   
    if (!match) return null;

    const token = jwt.sign({ id: usuarioEncontrado!.id, email: usuarioEncontrado!.email, rol: usuarioEncontrado!.rol }, 
    process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" as any });
    return token;
};

export const eliminarUsuario = async (email:string) => {
    const usuario = await prisma.usuario.findUnique({ //Buscar usuario por email para obtener su id
        where: { email }
    })
    if (!usuario) {
        throw new AppError("Usuario no encontrado", 404);
    }
    await prisma.prestamo.deleteMany({ //usar ese id para eliminar los prestamos asociados
        where: { usuarioId: usuario.id }
    })
    await prisma.usuario.delete({ //eliminar el usuario
        where: { email }
    })
    return { mensaje: "Usuario eliminado" };
};


//listar todos los usuarios (solo para el panel de administracion)
export const listarUsuarios = async () => {
    return await prisma.usuario.findMany({
        select: {
            id: true,
            nombre: true,
            email: true,
            rol: true
            // password nunca se incluye aqui, por seguridad
        }
    });
};
 
type ActualizarUsuarioAdminData = {
    nombre?: string;
    email?: string;
    rol?: string;
};
 
//actualizar nombre, email y/o rol de OTRO usuario (solo admin).
//Separada de actualizarDatos a proposito: esta si puede tocar el rol,
//la de auto-edicion nunca deberia poder hacerlo.
export const actualizarUsuarioComoAdmin = async (id: string, data: ActualizarUsuarioAdminData) => {
    const dataActualizada: Partial<{ nombre: string; email: string; rol: "admin" | "user" }> = {};
 
    if (data.nombre) dataActualizada.nombre = data.nombre;
    if (data.email) dataActualizada.email = data.email;
    if (data.rol !== undefined) {
        if (data.rol !== "admin" && data.rol !== "user") {
            throw new AppError("El rol debe ser 'admin' o 'user'", 400);
        }
        dataActualizada.rol = data.rol;
    }
 
    try {
        const usuarioActualizado = await prisma.usuario.update({
            where: { id },
            data: dataActualizada,
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true
            }
        });
        return usuarioActualizado;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new AppError("El email ya está registrado", 409);
            }
            if (error.code === "P2025") {
                throw new AppError("Usuario no encontrado", 404);
            }
        }
        throw error;
    }
};


//actualizar datos
export const actualizarDatos = async (id: string, data: { nombre?: string, email?: string }) => {
    const dataActualizada: Partial<{ nombre: string, email: string }> = {}; 
    if (data.nombre) dataActualizada.nombre = data.nombre;
    if (data.email) dataActualizada.email = data.email;
    //Prisma con exactOptionalPropertyTypes no acepta undefined como valor para campos opciones, por lo que lo interpreta como "no proporcionado"
    //Por eso construimos un objeto limpio que contiene los campos que realmente se proporcionan en el objeto data
    
    try {
        const actualizarUsuario = await prisma.usuario.update({
            where: { id },
            data: dataActualizada,
            select: {
                id: true,
                nombre: true,
                email: true
            }
        })
        return actualizarUsuario;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new AppError("El email ya está registrado", 409);
        }
        throw error;
    }
};