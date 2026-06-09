import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type UsuarioData = {
    nombre: string;
    email: string;
    password: string;
};

export const registrarUsuario = async (data:UsuarioData) => {
    const { nombre, email, password } = data;
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
}; 

export const loginUsuario = async (email:string, password:string) => {
    try {
    const usuarioEncontrado = await prisma.usuario.findUnique({
        where: { email }
    })
    
    
        if (!usuarioEncontrado) return null;

        const match = await bcrypt.compare(password, usuarioEncontrado!.password); //usuarioEncontrado! se usa para indicar que estamos seguros de que no es null, ya que si fuera null, el código no llegaría a esta línea debido al return anterior   
        if (!match) return null;

        const token = jwt.sign({ id: usuarioEncontrado!.id, email: usuarioEncontrado!.email, rol: usuarioEncontrado!.rol }, 
        process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" as any });
        return token;
        
    } catch (error) {
        throw error;
}   
};

export const eliminarUsuario = async (email:string) => {
    try {
        const usuario = await prisma.usuario.findUnique({ //Buscar usuario por email para obtener su id
            where: { email }
        })
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        await prisma.prestamo.deleteMany({ //usar ese id para eliminar los prestamos asociados
            where: { usuarioId: usuario.id }
        })
        await prisma.usuario.delete({ //eliminar el usuario
            where: { email }
        })
        return { mensaje: "Usuario eliminado" };
        } catch (error) {
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
            throw error;
            }
};

