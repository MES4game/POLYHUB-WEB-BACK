import mysql from 'mysql2/promise';

export const DB = mysql.createPool({
    host:     process.env.DB_HOST ?? 'localhost',
    port:     Number(process.env.DB_PORT ?? 3306),
    user:     process.env.DB_USER ?? 'user',
    password: process.env.DB_PASS ?? 'password',
    database: process.env.DB_NAME ?? 'database'
});
