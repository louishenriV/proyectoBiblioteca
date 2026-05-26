import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization; //Lee el header Authorization de la petición que es donde se suele enviar el token de autenticación
    if (!authHeader) {
        return res.status(401).json({ mensaje: "Token no proporcionado" }); //Si no hay token, respondemos con un error 401 (no autorizado) 
        //y un mensaje indicando que el token no fue proporcionado
    }

    const token = authHeader.split(" ")[1]; // Extraemos el token del encabezado
    // el header va traer "Bearer token", por eso se hace el split para obtener solo el token
    if (!token) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; //Verifica el token con jwt.verify() usando la clave secreta 
        req.headers = decoded; // Agregamos la información del usuario al objeto de solicitud
        next(); // si es valida, continuamos con la siguiente función de middleware o ruta
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido" }); //rechaza con 401 si no es valido
    }
}