import app from "@/app";
import { ENV } from "@/config/env.config";

const SERVER = app.listen(ENV.port, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${ENV.port.toString()}`);
});

SERVER.on("error", (err: Error) => {
    if ("code" in err && err.code === "EADDRINUSE") console.error(`Port ${ENV.port.toString()} is already in use. Please choose another port or stop the process using it.`);
    else console.error("Failed to start server:", err);
    process.exit(1);
});
