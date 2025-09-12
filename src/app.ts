import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { SWAGGER_DOCUMENTATION, SWAGGER_OPTIONS } from "@/config/swagger.config";
import routes from "@/routes/routes";

const app = express();

app.use(express.json());

// Extern Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("combined"));

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? `https://${process.env.DOMAIN ?? ''}` : `https://dev.${process.env.DOMAIN ?? ''}`
}));

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCUMENTATION, SWAGGER_OPTIONS));

// Routes
app.use("/", routes);
app.use("/api", swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCUMENTATION));

export default app;
