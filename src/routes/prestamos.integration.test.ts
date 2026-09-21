import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";

const emailDePrueba = "test-email@prueba.com"
const passwordDePrueba = "Password012" //Tener siempre en cuenta que la contraseña debe cumplir con los requisitos de seguridad establecidos en el sistema, como longitud mínima, inclusión de caracteres especiales, etc.
const tituloLibro = "Libro para préstamos de prueba";

let token: string;
let libroId: string;
let prestamoId: string;

describe("Flujo de préstamos de libros", () => {
    beforeAll(async () => {
        // Registramos un usuario de prueba
        await request(app).post("/auth/registro").send({
            nombre: "Usuario de prueba",
            email: emailDePrueba,
            password: passwordDePrueba
        });

        // Hacemos login para obtener el token
        const loginResponse = await request(app).post("/auth/login").send({
            email: emailDePrueba,
            password: passwordDePrueba
        });

        token = loginResponse.body.token;

        // Creamos un libro de prueba
        const libroResponse = await prisma.libro.create({
            data: { titulo: tituloLibro, autor: "Autor de prueba", anioPublicacion: 2020 }
        });

        libroId = libroResponse.id;
    });

    afterAll(async () => {
        // Limpiamos la base de datos eliminando el usuario y el libro de prueba
        await prisma.prestamo.deleteMany({ where: { libroId } });
        await prisma.usuario.deleteMany({ where: { email: emailDePrueba } });
        await prisma.libro.deleteMany({ where: { titulo: tituloLibro } });
    })

    test("crea un préstamo exitosamente", async () => {
    const response = await request(app)
        .post("/prestamos")
        .set("Authorization", `Bearer ${token}`)
        .send({ libroId });

    expect(response.status).toBe(201);
    prestamoId = response.body.prestamo.id;
    });

    test("Crea un segundo préstamo para el mismo libro y usuario, esperando un error", async () => {
        const response = await request(app)
            .post("/prestamos")
            .set("Authorization", `Bearer ${token}`)
            .send({ libroId });

        expect(response.status).toBe(409);
        expect(response.body.mensaje).toBe("El libro ya está prestado");
    });

    test("devuelve el libro exitosamente", async () => {
        const response = await request(app)
            .put(`/prestamos/${prestamoId}/devolver`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
    });
})
