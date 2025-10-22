import mysql from "mysql2/promise";
import { ENV } from "@/config/env.config";

export const DB = mysql.createPool({
    host    : ENV.db_host,
    port    : ENV.db_port,
    user    : ENV.db_user,
    password: ENV.db_pass,
    database: ENV.db_name,
});
