export class AppError extends Error {
    statusCode: number;

    constructor(mensaje: string, statusCode: number) {
        super(mensaje);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}