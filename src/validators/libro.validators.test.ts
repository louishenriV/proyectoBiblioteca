import { describe, test, expect } from "vitest";
import { validarDatosLibro } from "./libroValidator.js";

describe("validarDatosLibro", () => {

    test("rechaza titulo vacío", () => {
        const resultado = validarDatosLibro({
            titulo: "",
            autor: "Gabriel García Márquez",
            anioPublicacion: 1967
        });

        expect(resultado.valido).toBe(false);
    });

    test("rechaza titulo con solo espacios en blanco", () => {
        const resultado = validarDatosLibro({
            titulo: "   ",
            autor: "Gabriel García Márquez",
            anioPublicacion: 1967
        });

        expect(resultado.valido).toBe(false);
    });

    test("rechaza autor vacío", () => {
        const resultado = validarDatosLibro({
            titulo: "Cien años de soledad",
            autor: "",
            anioPublicacion: 1967
        });

        expect(resultado.valido).toBe(false);
    });

    test("rechaza anioPublicacion que no es numero", () => {
        const resultado = validarDatosLibro({
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            anioPublicacion: "1967" // string en vez de number, error comun al mandar datos de un form
        });

        expect(resultado.valido).toBe(false);
    });

    test("rechaza cuando falta un campo por completo (undefined)", () => {
        const resultado = validarDatosLibro({
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            anioPublicacion: undefined
        });

        expect(resultado.valido).toBe(false);
    });

    test("acepta datos validos", () => {
        const resultado = validarDatosLibro({
            titulo: "Cien años de soledad",
            autor: "Gabriel García Márquez",
            anioPublicacion: 1967
        });

        expect(resultado.valido).toBe(true);
        expect(resultado.mensaje).toBeUndefined();
    });

});