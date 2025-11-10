import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import { DB } from "@/config/db.config";
import { User, mapPatchPasswordToken, mapUser } from "@/models/user.model";
import { RequestSuccess, RequestError } from "@/models/common.model";
import { issueToken, verifyToken } from "@/config/jwt.config";
import { TRANSPORTER } from "@/config/mail.config";
import { ENV } from "@/config/env.config";
import { isValidEmail, isValidPassword } from "@/utils/regex.util";

export async function userGetSelf(current_user?: User): Promise<RequestSuccess<User>> {
    if (current_user === undefined) throw new RequestError(404, "User not found");

    const query = "SELECT * FROM `users` WHERE `id` = ? LIMIT 1";
    const [rows] = await DB.execute<RowDataPacket[]>(query, [current_user.id]);
    const user = mapUser(rows[0]);

    return new RequestSuccess(200, user);
}

export async function userGetById(user_id: number): Promise<RequestSuccess<User>> {
    if (user_id <= 0) throw new RequestError(400, "Invalid user ID");

    const query = "SELECT * FROM `users` WHERE `id` = ? LIMIT 1";
    const [rows] = await DB.execute<RowDataPacket[]>(query, [user_id]);
    const user = mapUser(rows[0]);

    if (user.id === mapUser.schema.id.default) throw new RequestError(404, "User not found");

    return new RequestSuccess(200, user);
}

export async function userGetAll(): Promise<RequestSuccess<User[]>> {
    const query = "SELECT * FROM `users`";
    const [rows] = await DB.execute<RowDataPacket[]>(query);
    const users = rows.map((row) => { return mapUser(row); });

    return new RequestSuccess(200, users);
}

export async function userPatchPseudo(new_pseudo: string, current_user?: User): Promise<RequestSuccess> {
    if (current_user === undefined) throw new RequestError(404, "User not found");

    if ((await DB.execute<RowDataPacket[]>("SELECT * FROM `users` WHERE `pseudo` = ? LIMIT 1", [new_pseudo]))[0].length > 0) {
        throw new RequestError(409, "Pseudo already used by another user");
    }

    const query = "UPDATE `users` SET `pseudo` = ? WHERE `id` = ?";
    await DB.execute(query, [new_pseudo, current_user.id]);

    return new RequestSuccess(204);
}

export async function userPatchFirstname(new_firstname: string, current_user?: User): Promise<RequestSuccess> {
    if (current_user === undefined) throw new RequestError(404, "User not found");

    const query = "UPDATE `users` SET `firstname` = ? WHERE `id` = ?";
    await DB.execute(query, [new_firstname, current_user.id]);

    return new RequestSuccess(204);
}

export async function userPatchLastname(new_lastname: string, current_user?: User): Promise<RequestSuccess> {
    if (current_user === undefined) throw new RequestError(404, "User not found");

    const query = "UPDATE `users` SET `lastname` = ? WHERE `id` = ?";
    await DB.execute(query, [new_lastname, current_user.id]);

    return new RequestSuccess(204);
}

export async function userPostResetPassword(email: string): Promise<RequestSuccess> {
    if (!isValidEmail(email)) throw new RequestError(404, "Invalid email format");

    const query = "SELECT * FROM `users` WHERE `email` = ? LIMIT 1";
    const [rows] = await DB.execute<RowDataPacket[]>(query, [email]);
    const user = mapUser(rows[0]);

    if (user.id === mapUser.schema.id.default) throw new RequestError(404, "User not found");

    try {
        const password_token = issueToken(mapPatchPasswordToken({ id: user.id }), user.id.toString(), "1h", true);

        await TRANSPORTER.sendMail({
            from   : ENV.smtp_user,
            to     : user.email,
            subject: `[${ENV.host}] - Confirm your password reset`,
            text   : `Click this link to reset your password: ${ENV.front_url}/password/reset/${password_token}. This link will expire in 1 hour.`,
        });
    }
    catch(err) {
        throw new Error("Error while sending password reset email: " + (err as Error).message);
    }

    return new RequestSuccess(204);
}

export async function userPatchPassword(token: string, new_password: string): Promise<RequestSuccess> {
    if (!token) throw new RequestError(400, "No token found");
    
    if (!isValidPassword(new_password)) {
        throw new RequestError(400, "No password given or bad format (/^[\\w!#%*+/_~-]{12,64}$/)");
    }

    const { id } = verifyToken(token, mapPatchPasswordToken);

    if (id === mapPatchPasswordToken.schema.id.default) throw new RequestError(401, "Invalid token");

    await DB.execute(
        "UPDATE `users_hashed_pass` SET `hashed_pass` = ? WHERE `user_id` = ?",
        [await bcrypt.hash(new_password, 15), id],
    );

    return new RequestSuccess(204);
}
