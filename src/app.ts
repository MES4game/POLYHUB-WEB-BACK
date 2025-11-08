import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { ENV } from "@/config/env.config";
import { errorHandler } from "@/middlewares/error.middleware";
import { RegisterRoutes } from "@/routes";
import * as SWAGGER_SPEC from "@/swagger.json";

const app = express();

app.use(express.json());

// Extern Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("combined"));

app.use(cors({
    origin     : `https://${ENV.dev ? "dev." : ""}${ENV.host}`,
    credentials: true,
}));

/* eslint-disable */
// Routes
RegisterRoutes(app);

// Swagger docs
app.use("/api", swaggerUi.serve, swaggerUi.setup(SWAGGER_SPEC));
/* eslint-enable */

// Error handler
app.use(errorHandler);

export default app;
