import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Biblioteca",
            version: "1.0.0",
            description: "API para gestión de biblioteca personal"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        
    },    
    apis: ["./src/routes/*.ts"]
}

export const swaggerSpec = swaggerJSDoc(options);