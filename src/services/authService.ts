import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (data:any) => {
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
} 

export const loginUsuario = async (email:string, password:string) => {
    try {
    const usuarioEncontrado = await prisma.usuario.findUnique({
        where: { email }
    })
    
    
        if (!usuarioEncontrado) return null;

        const match = await bcrypt.compare(password, usuarioEncontrado!.password); //usuarioEncontrado! se usa para indicar que estamos seguros de que no es null, ya que si fuera null, el código no llegaría a esta línea debido al return anterior   
        if (!match) return null;

        const token = jwt.sign({ id: usuarioEncontrado!.id, email: usuarioEncontrado!.email }, 
        process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" as any });
        return token;
        
} catch (error) {
    throw error;
}   
}