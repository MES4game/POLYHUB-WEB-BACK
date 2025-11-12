const ARGS = process.argv.slice(2);
const PORT_ARG = ARGS[ARGS.findIndex((arg) => { return arg.startsWith("--port"); }) + 1];

interface IEnv {
    host     : string;
    port     : number;
    dev      : boolean;
    db_host  : string;
    db_port  : number;
    db_user  : string;
    db_pass  : string;
    db_name  : string;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_pass: string;
    front_url: string;
    langs    : string[];
}

export const ENV: IEnv = {
    host     : process.env.HOST ?? "localhost",
    port     : Number(process.env.PORT ?? PORT_ARG ?? 3000),
    dev      : process.env.NODE_ENV === "development",
    db_host  : process.env.DB_HOST ?? "localhost",
    db_port  : Number(process.env.DB_PORT ?? 3306),
    db_user  : process.env.DB_USER ?? "user",
    db_pass  : process.env.DB_PASS ?? "secret",
    db_name  : process.env.DB_NAME ?? "db",
    smtp_host: process.env.SMTP_HOST ?? "localhost",
    smtp_port: Number(process.env.SMTP_PORT ?? 25),
    smtp_user: process.env.SMTP_USER ?? "user@localhost",
    smtp_pass: process.env.SMTP_PASS ?? "secret",
    front_url: process.env.FRONT_URL ?? "http://localhost:3000",
    langs    : ["en", "fr"],
};
