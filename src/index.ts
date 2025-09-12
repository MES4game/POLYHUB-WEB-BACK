import app from "@/app";

const PORT = Number((process.env.NODE_ENV === "production" ? process.env.PORT : process.env.PORT_DEV) ?? 3000);
const SERVER = app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT.toString()}`);
});

SERVER.on("error", (err: Error) => {
    if ("code" in err && err.code === "EADDRINUSE")
        console.error(`Port ${PORT.toString()} is already in use. Please choose another port or stop the process using it.`);
    else console.error("Failed to start server:", err);
    process.exit(1);
});
