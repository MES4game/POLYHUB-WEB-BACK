const ARGS = process.argv.slice(2);
const PORT_ARG = ARGS[ARGS.findIndex((arg) => { return arg.startsWith("--port"); }) + 1];

interface IEnv {
    host       : string;
    dev        : boolean;
    port       : number;
    db_host    : string;
    db_port    : number;
    db_user    : string;
    db_pass    : string;
    db_name    : string;
    mail_host  : string;
    mail_port  : number;
    mail_user  : string;
    mail_pass  : string;
    data_folder: string;
    langs      : string[];
}

export const ENV: IEnv = {
    host       : process.env.HOST ?? "localhost",
    dev        : process.env.NODE_ENV === "development",
    port       : Number(process.env.PORT ?? PORT_ARG ?? 3000),
    db_host    : process.env.DB_HOST ?? "localhost",
    db_port    : Number(process.env.DB_PORT ?? 3306),
    db_user    : process.env.DB_USER ?? "user",
    db_pass    : process.env.DB_PASS ?? "secret",
    db_name    : process.env.DB_NAME ?? "db",
    mail_host  : process.env.MAIL_HOST ?? "localhost",
    mail_port  : Number(process.env.MAIL_PORT ?? 587),
    mail_user  : process.env.MAIL_USER ?? "user@localhost",
    mail_pass  : process.env.MAIL_PASS ?? "secret",
    data_folder: process.env.DATA_FOLDER ?? "./data",
    langs      : ["en", "fr"],
};
