import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB } from "@/config/db.config";
import { Mapper } from "@/utils/mapper.util";

export async function dbSelect<T>(
    mapT: Mapper<T>,
    table: string,
    where?: string,
    limit?: number,
    args: unknown[] = [],
): Promise<T[]> {
    let query = `SELECT * FROM \`${table}\``;

    if (where) query += ` WHERE ${where}`;
    if (limit && limit > 0) query += ` LIMIT ${limit.toString()}`;

    const [rows] = await DB.execute<RowDataPacket[]>(query, args);

    return rows.map(mapT);
}

export async function dbInsert<T extends string[]>(
    table: string,
    columns: [...T],
    args: { [K in keyof T]: unknown },
): Promise<number> {
    const cols = columns.map((col) => { return `\`${col}\``; }).join(", ");
    const vals = columns.map(() => { return "?"; }).join(", ");
    const query = `INSERT INTO \`${table}\` (${cols}) VALUES (${vals})`;
    const [result] = await DB.execute<ResultSetHeader>(query, args);

    return result.insertId;
}

export async function dbDelete(
    table: string,
    where: string,
    args: unknown[] = [],
): Promise<void> {
    const query = `DELETE FROM \`${table}\` WHERE ${where}`;
    await DB.execute(query, args);
}

export async function dbUpdate(
    table: string,
    set: string,
    where?: string,
    args: unknown[] = [],
): Promise<void> {
    let query = `UPDATE \`${table}\` SET ${set}`;

    if (where) query += ` WHERE ${where}`;

    await DB.execute(query, args);
}
