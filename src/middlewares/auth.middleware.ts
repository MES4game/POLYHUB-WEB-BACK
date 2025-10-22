import { Request } from "express";
import { RowDataPacket } from "mysql2";
import { DB } from "@/config/db.config";
import { verifyToken } from "@/config/jwt.config";
import { mapUser } from "@/models/user.model";
import { User } from "../models/user.model";
import { mapAuthToken } from "@/models/auth.model";
import { unknowErrToString } from "@/utils/convert.util";

export async function expressAuthentication(
    request: Request,
    security_name: string,
    scopes?: string[],
): Promise<User> {
    if (security_name !== "auth") throw new Error("Not known security scheme (Internal Server Error)");

    let user = {} as User;

    if (request.headers.authorization) {
        try {
            user = await authenticateFromToken(request.headers.authorization);
        }
        catch(error: unknown) {
            throw new Error(`__AUTH_ERROR__NO_LOGIN__: ${unknowErrToString(error)}`);
        }

        if (scopes) {
            try {
                if (!await checkRoles(user.id, scopes)) throw new Error("");
            }
            catch {
                throw new Error(`Unauthorized, reserved to: ${scopes.join(", ")}`);
            }
        }
    }

    request.user = user;

    return request.user;
}

async function authenticateFromToken(auth_header: string): Promise<User> {
    if (!auth_header) throw new Error("No Authorization header");

    const token = auth_header.replace("Bearer ", "");
    const { id } = verifyToken(token, mapAuthToken);

    const [rows] = await DB.execute<RowDataPacket[]>("SELECT * FROM `users` WHERE `id` = ?", [id]);
    if (rows.length === 0) throw new Error("No user finded for login");

    await DB.execute("UPDATE `users` SET `last_connection` = NOW() WHERE `id` = ?", [id]);

    return mapUser(rows[0] ?? {});
}

export async function checkRoles(user_id: number, roles: string[]): Promise<boolean> {
    if (!roles.length) return true;

    const placeholders = roles.map(() => { return "?"; }).join(",");

    const query = `
        SELECT *
        FROM \`users_roles\` ur
        INNER JOIN \`roles\` r ON r.\`id\` = ur.\`role_id\`
        WHERE ur.\`user_id\` = ? AND r.\`name\` IN (${placeholders})
        LIMIT 1
    `;

    const [rows] = await DB.query<RowDataPacket[]>(query, [user_id, ...roles]);

    return rows.length > 0;
}
