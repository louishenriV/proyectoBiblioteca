import { describe, test, expect } from "vitest";

describe("entorno de pruebas", () => {
    test("usa la base de datos de prueba, no la de desarrollo", () => {
        expect(process.env.DATABASE_URL).toContain("biblioteca_test");
    });
}); //confirmar que el texto "biblioteca_test" aparece en algún lugar dentro de esa URL.