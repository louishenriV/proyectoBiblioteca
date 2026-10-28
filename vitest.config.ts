import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./vitest.setup.ts"],
        exclude: ["**/node_modules/**", "**/dist/**"]
    }
}); //aquí es donde le decimos a vitest "usa ese archivo de arriba como preparación antes de cada test".