import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.usuario && req.usuario.rol === 'admin') { // Verifica si el usuario tiene el rol de admin
        next(); // Si es admin, continúa con la siguiente función de middleware o ruta
    } else {
        return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol de admin' }); // Si no es admin, responde con un error 403 (prohibido)
    }  
}  



/**El adminMiddleware sirve para proteger rutas que solo un administrador debería poder usar. En mi proyecto eso aplica a:

Agregar libros al acervo — un usuario normal no debería poder meter libros a la biblioteca
Eliminar libros del acervo — igual, solo el admin
Eliminar usuarios — cuando lo implementemos */