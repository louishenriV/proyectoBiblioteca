import prisma from "../prismaClient";

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
    console.log("Usuario registrado:", nuevoUsuario);
    return nuevoUsuario;
} 
