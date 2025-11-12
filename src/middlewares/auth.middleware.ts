import { Request } from "express";
import { RowDataPacket } from "mysql2";
import { DB } from "@/config/db.config";
import { verifyToken } from "@/config/jwt.config";
import { mapUser } from "@/models/user.model";
import { User } from "../models/user.model";
import { mapAuthToken } from "@/models/auth.model";
import { unknowErrToString } from "@/utils/convert.util";
import { RequestError } from "@/models/common.model";
import { dbSelect, dbUpdate } from "@/utils/db.utils";

export async function expressAuthentication(
    request: Request,
    security_name: string,
    scopes?: string[],
): Promise<User> {
    if (security_name !== "auth") throw new RequestError(500, "Not known security scheme");

    let user = mapUser({});

    try {
        user = await authenticateFromToken(request.headers.authorization ?? "");
    }
    catch(error: unknown) {
        if (scopes !== undefined) {
            throw error;
        }
    }

    if (scopes !== undefined) {
        try {
            if (!await checkRoles(user.id, scopes)) throw new Error();
        }
        catch {
            throw new RequestError(403, `Unauthorized, reserved to: ${scopes.join(", ")}`);
        }
    }

    request.user = user;

    return request.user;
}

async function authenticateFromToken(auth_header: string): Promise<User> {
    const token = auth_header.replace("Bearer ", "");

    if (!token) {
        throw new RequestError(401, "No token finded in Authorization header");
    }

    try {
        const { id } = verifyToken(token, mapAuthToken);

        const [user] = await dbSelect(mapUser, "users", "`id` = ?", 1, [id]);

        if (user === undefined || user.id === mapUser.schema.id.default) {
            throw new Error("No user finded for login");
        }

        await dbUpdate("users", "`last_connection` = NOW()", "`id` = ?", [id]);

        return user;
    }
    catch(error: unknown) {
        throw new RequestError(401, `__AUTH_ERROR__NO_LOGIN__: ${unknowErrToString(error)}`);
    }
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
