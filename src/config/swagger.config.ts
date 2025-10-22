import swaggerJsdoc from "swagger-jsdoc";
import { ENV } from "@/config/env.config";

const DOC_JSON_OPTIONS: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.1.0",
        info   : {
            title      : `API of ${ENV.dev ? "dev." : "api."}${ENV.host}${ENV.dev ? "/api" : ""}`,
            version    : "1.0.0",
            description: "Auto-generated Swagger documentation",
        },
    },
    apis: ["./src/routes/*.ts"],
};

export const SWAGGER_SPEC = swaggerJsdoc(DOC_JSON_OPTIONS);

/*
 *export async function getOpenApiSpec() {
 *    const spec = await generateSpec(
 *        {
 *            entryFile: path.resolve(__dirname, "../index.ts"),
 *            controllerPathGlobs: [path.resolve(__dirname, "../controllers/*.controller.ts")],
 *            noImplicitAdditionalProperties: "throw-on-extras",
 *            outputDirectory: "ignored",
 *            specFileBaseName: "swagger",
 *            specVersion: 3,
 *            version: "1.0.0",
 *            name: `API of ${ENV.dev ? 'dev.' : 'api.'}${ENV.host}${ENV.dev ? '/api' : ''}`,
 *            description: "Auto-generated API documentation with tsoa",
 *            host: `${ENV.dev ? 'dev.' : 'api.'}${ENV.host}`,
 *            servers: [
 *                { url: `https://${ENV.dev ? 'dev.' : 'api.'}${ENV.host}${ENV.dev ? '/api' : ''}`, description: "Server" },
 *            ] as any,
 *            basePath: "/api",
 *            spec: {
 *                outputDirectory: "ignored",
 *                yaml: false
 *            },
 *            specMerging: "recursive",
 *            operationIdTemplate: "{{titleCase method.name}}",
 *            securityDefinitions: {
 *                BearerAuth: {
 *                    type: "http",
 *                    scheme: "bearer",
 *                    bearerFormat: "JWT",
 *                    description: "Enter your JWT token"
 *                }
 *            },
 *            rootSecurity: [{ BearerAuth: [] }],
 *            tags: [
 *                { name: "Example", description: "Example operations" },
 *                { name: "System", description: "System endpoints" }
 *            ],
 *            schemes: ["https"],
 *            xEnumVarnames: true,
 *            useTitleTagsForInlineObjects: true,
 *            yaml: false
 *        },
 *        {},
 *        false
 *    );
 *
 *    // Dynamically register routes
 *    await generateRoutes(
 *        {
 *            entryFile: path.resolve(__dirname, "server.ts"),
 *            controllerPathGlobs: [path.resolve(__dirname, "controllers/*.controller.ts")],
 *            noImplicitAdditionalProperties: "throw-on-extras",
 *            routesDir: path.resolve(__dirname, "routes")
 *        },
 *        {},
 *        false // don't write to disk if you don't want
 *    );
 *
 *    return spec;
 *}
 */
