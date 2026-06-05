import {JwtPayload} from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            usuario: JwtPayload & { rol?: string }; // Agrega la propiedad 'headers' al tipo Request de Express
        }
    }
}
/**Esto le dice a TypeScript que el objeto Request de Express tiene
 * una propiedad adicional llamada usuario. Con eso ya puedes 
 * usar req.usuario = decoded sin errores. */