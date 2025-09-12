import swaggerJsdoc from "swagger-jsdoc";

const OPTIONS: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: `API of ${process.env.NODE_ENV === "development" ? 'dev.' : ''}${process.env.DOMAIN ?? ''}`,
            version: "1.0.0",
            description: "Auto-generated Swagger documentation"
        }
    },
    apis: ["./src/routes/*.ts"]
};

export const SWAGGER_DOCUMENTATION = swaggerJsdoc(OPTIONS);
export const SWAGGER_OPTIONS = {
    swaggerOptions: {
        tryItOutEnabled: process.env.NODE_ENV !== "production",
        docExpansion: process.env.NODE_ENV === "production" ? "none" : "list",
        persistAuthorization: process.env.NODE_ENV !== "production",
        displayRequestDuration: process.env.NODE_ENV !== "production",
        deepLinking: process.env.NODE_ENV !== "production"
    }
};
