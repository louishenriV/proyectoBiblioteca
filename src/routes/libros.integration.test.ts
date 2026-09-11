import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";


describe("GET /libros", () => {
    test("responde 401 si no se manda un token", async () => {
        const response = await request(app).get("/libros");

        expect(response.status).toBe(401);
    });
});

describe("POST /libros con token de admin", () => {
    const emailAdmin = "test-admin-libros@ejemplo.com";
    const passwordAdmin = "Password123";
    let token: string;

    beforeAll(async () => { //primero registramos un usuario admin, luego hacemos login y obtenemos el token para usarlo en las pruebas
        await request(app).post("/auth/registro").send({
            nombre: "Admin de prueba",
            email: emailAdmin,
            password: passwordAdmin
        });

        await prisma.usuario.update({
            where: { email: emailAdmin },
            data: { rol: "admin" }
        });

        const loginResponse = await request(app).post("/auth/login").send({
            email: emailAdmin,
            password: passwordAdmin
        });

        token = loginResponse.body.token;
    }); //hacemos login ya como admin, primero indicamos el rol, luego nos logueamos

    afterAll(async () => {
        await prisma.libro.deleteMany({ where: { titulo: "Libro de prueba" } });
        await prisma.usuario.deleteMany({ where: { email: emailAdmin } });
    }); //limpiamos la base de datos eliminando el libro de prueba y el usuario admin creado para las pruebas

    test("crea un libro exitosamente", async () => {
        const response = await request(app)
            .post("/libros")
            .set("Authorization", `Bearer ${token}`)
            .send({ titulo: "Libro de prueba", autor: "Autor de prueba", anioPublicacion: 2020 });

        expect(response.status).toBe(200);
        expect(response.body.libro.titulo).toBe("Libro de prueba");
    });
});