import { RowDataPacket } from "mysql2";
import { DB } from "@/config/db.config";
import { User, mapUser } from "@/models/user.model";
import { ServiceResponse } from "@/models/common.model";

export async function getSelf(current_user?: User): Promise<ServiceResponse<User>> {
    if (!current_user) return { code: 401, body: mapUser({}) };

    const query = "SELECT * FROM `users` WHERE `id` = ? LIMIT 1";
    const [rows] = await DB.execute<RowDataPacket[]>(query, [current_user.id]);
    const user = mapUser(rows[0]);

    return { code: 200, body: user };
}
