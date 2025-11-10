import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ENV } from "@/config/env.config";
import { DB } from "@/config/db.config";
import { TRANSPORTER } from "@/config/mail.config";
import { issueToken, verifyToken } from "@/config/jwt.config";
import { RequestSuccess, RequestError } from "@/models/common.model";
import { mapAuthToken, BodyRegister, BodyLogin } from "@/models/auth.model";
import { mapUser, mapUserHashedPassword } from "@/models/user.model";
import { isValidEmail, isValidPassword, isValidPseudo } from "@/utils/regex.util";

export async function authPostRegister(body: BodyRegister): Promise<RequestSuccess> {
    if (!isValidEmail(body.email)) {
        throw new RequestError(400, "No email given or bad format");
    }

    if (!isValidPseudo(body.pseudo)) {
        throw new RequestError(
            400,
            "No pseudo given or bad format (4-64 characters and /^(?:[\\w!#$%&'*+/=?^_`{|}~-]+\\.)+[\\w!#$%&'*+/=?^_`{|}~-]+$/)",
        );
    }

    if (!isValidPassword(body.password)) {
        throw new RequestError(400, "No password given or bad format (/^[\\w!#%*+/_~-]{12,64}$/)");
    }

    if (body.firstname.length < 1 || body.firstname.length > 64) {
        throw new RequestError(400, "No firstname given or bad format (1-64 characters)");
    }

    if (body.lastname.length < 1 || body.lastname.length > 64) {
        throw new RequestError(400, "No lastname given or bad format (1-64 characters)");
    }

    if ((await DB.execute<RowDataPacket[]>("SELECT * FROM `users` WHERE `email` = ? LIMIT 1", [body.email]))[0].length > 0) {
        throw new RequestError(409, "Email already used by another user");
    }

    if ((await DB.execute<RowDataPacket[]>("SELECT * FROM `users` WHERE `pseudo` = ? LIMIT 1", [body.pseudo]))[0].length > 0) {
        throw new RequestError(409, "Pseudo already used by another user");
    }

    const id = (await DB.execute<ResultSetHeader>(
        "INSERT INTO `users` (`email`, `pseudo`, `firstname`, `lastname`) VALUES (?, ?, ?, ?)",
        [body.email, body.pseudo, body.firstname, body.lastname],
    ))[0].insertId;

    try {
        await DB.execute(
            "INSERT INTO `users_hashed_pass` (`user_id`, `hashed_pass`) VALUES (?, ?)",
            [id, await bcrypt.hash(body.password, 15)],
        );

        const verification_token = issueToken(mapAuthToken({ id: id }), id.toString(), "1h", true);

        await TRANSPORTER.sendMail({
            from   : ENV.smtp_user,
            to     : body.email,
            subject: `[${ENV.host}] - Verify your email`,
            text   : `Click this link to verify your email: https://api.${ENV.host}/auth/verify/${verification_token}. This link will expire in 1 hour.`,
        });
    }
    catch(err) {
        await DB.execute(
            "DELETE FROM `users` WHERE `id` = ?",
            [id],
        );

        throw new Error("Error while registering user: " + (err as Error).message);
    }

    return new RequestSuccess(204);
}

export async function authPatchVerifyEmail(token: string): Promise<RequestSuccess> {
    if (!token) throw new RequestError(400, "No token found");

    const { id } = verifyToken(token, mapAuthToken);

    if (id === mapAuthToken.schema.id.default) throw new RequestError(401, "Invalid token");

    await DB.execute("UPDATE `users` SET `verified_email` = true WHERE `id` = ?", [id]);

    return new RequestSuccess(204);
}

export async function authPostLogin(body: BodyLogin): Promise<RequestSuccess<{ token: string }>> {
    if (!isValidEmail(body.email_pseudo) && !isValidPseudo(body.email_pseudo)) {
        throw new RequestError(400, "No email/pseudo given or bad format");
    }

    if (!isValidPassword(body.password)) {
        throw new RequestError(400, "No password given or bad format (/^[\\w!#%*+/_~-]{12,64}$/)");
    }

    const [rows] = await DB.execute<RowDataPacket[]>(
        "SELECT * FROM `users` WHERE `email` = ? OR `pseudo` = ? LIMIT 1",
        [body.email_pseudo, body.email_pseudo],
    );

    if (rows.length === 0) throw new RequestError(401, "Invalid credentials");

    const user = mapUser(rows[0] ?? {});

    if (!user.verified_email) throw new RequestError(403, "Email not verified");

    const user_hashed_password = mapUserHashedPassword((await DB.execute<RowDataPacket[]>(
        "SELECT * FROM `users_hashed_pass` WHERE `user_id` = ?",
        [user.id],
    ))[0][0]);
    const is_match = await bcrypt.compare(body.password, user_hashed_password.hashed_pass);
    if (!is_match) throw new RequestError(401, "Invalid credentials");

    const token = issueToken(mapAuthToken({ id: user.id }), user.id.toString(), "6h", false);

    return new RequestSuccess(200, { token: token });
}
