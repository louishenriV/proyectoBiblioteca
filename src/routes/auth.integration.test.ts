import { describe, test, expect, afterAll, beforeAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../prismaClient.js";

const emailDePrueba = "test-libros@ejemplo.com";
const passwordDePrueba = "Password123";
const emailAdmin = "admin@ejemplo.com";
const passwordAdmin = "Password234";
const emailUsuarioObj = "usuario@ejemplo.com";
const passwordUsuarioObj = "Password012";

let tokenAdmin: string;
let idUsuarioObj: string;

describe("GET /libros con token válido", () => {

    afterAll(async () => {
        // limpiamos el usuario de prueba para que este test se pueda volver a correr
        // sin toparse con el error de email duplicado (P2002)
        await prisma.usuario.deleteMany({ where: { email: emailDePrueba } });
    });

    test("responde 200 si el token es válido", async () => {
        await request(app).post("/auth/registro").send({
            nombre: "Usuario de prueba",
            email: emailDePrueba,
            password: passwordDePrueba
        });

        const loginResponse = await request(app).post("/auth/login").send({
            email: emailDePrueba,
            password: passwordDePrueba
        });

        const token = loginResponse.body.token;

        const response = await request(app)
            .get("/libros")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
    });

});

describe("GET /auth/usuarios con token de admin y PUT /auth/usuarios/:id", () => {
    beforeAll(async () => {
        // Registramos un usuario admin de prueba
        await request(app).post("/auth/registro").send({
            nombre: "Admin de prueba",
            email: emailAdmin,
            password: passwordAdmin
        });

        // Actualizamos el rol del usuario a admin
        await prisma.usuario.update({
            where: { email: emailAdmin },
            data: { rol: "admin" }
        });

        // Hacemos login para obtener el token de admin
        const loginResponse = await request(app).post("/auth/login").send({
            email: emailAdmin,
            password: passwordAdmin
        });

        //Registramos el usuario "objetivo" que vamos a actualizar en la prueba
        const registroUsuarioObj = await request(app).post("/auth/registro").send({
            nombre: "Usuario objetivo",
            email: emailUsuarioObj,
            password: passwordUsuarioObj
        }); 

        idUsuarioObj = registroUsuarioObj.body.usuario.id; //Necesitamos guardar el ID del usuario objetivo para poder hacer el PUT en la prueba

        tokenAdmin = loginResponse.body.token;
    })

    afterAll(async () => {
        // Limpiamos la base de datos eliminando el usuario admin y el usuario objetivo de prueba
        await prisma.usuario.deleteMany({ where: { email: emailAdmin } });
        await prisma.usuario.deleteMany({ where: { email: emailUsuarioObj } });

    });

    test("Lista todos los usuarios con token de admin", async () => {
        const response = await request(app)
        .get("/auth/usuarios")
        .set("Authorization", `Bearer ${tokenAdmin}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.usuarios)).toBe(true);
    });

    test("Actualiza el rol de un usuario con token de admin", async () => {
        const response = await request(app)
            .put(`/auth/usuarios/${idUsuarioObj}`)
            .set("Authorization", `Bearer ${tokenAdmin}`)
            .send({ rol: "admin" });

        expect(response.status).toBe(200);
        expect(response.body.usuario.rol).toBe("admin");
    });


});

