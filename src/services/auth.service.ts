import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ENV } from "@/config/env.config";
import { DB } from "@/config/db.config";
import { TRANSPORTER } from "@/config/mail.config";
import { issueToken, verifyToken } from "@/config/jwt.config";
import { ServiceResponse } from "@/models/common.model";
import { mapAuthToken, BodyRegister, BodyLogin } from "@/models/auth.model";
import { mapUser, mapUserHashedPassword } from "@/models/user.model";
import { isValidEmail, isValidPassword, isValidPseudo } from "@/utils/regex.util";

export async function register(body: BodyRegister): Promise<ServiceResponse<string>> {
    if (!isValidEmail(body.email)) {
        throw new Error("No email given or bad format");
    }

    if (!isValidPseudo(body.pseudo)) {
        throw new Error("No pseudo given or bad format (4-64 characters and /^(?:[\\w!#$%&'*+/=?^_`{|}~-]+\\.)+[\\w!#$%&'*+/=?^_`{|}~-]+$/)");
    }

    if (!isValidPassword(body.password)) {
        throw new Error("No password given or bad format (/^[\\w!#%*+/_~-]{12,64}$/)");
    }

    if (body.firstname.length < 1 || body.firstname.length > 64) {
        throw new Error("No firstname given or bad format (1-64 characters)");
    }

    if (body.lastname.length < 1 || body.lastname.length > 64) {
        throw new Error("No lastname given or bad format (1-64 characters)");
    }

    if ((await DB.execute<RowDataPacket[]>("SELECT * FROM `users` WHERE `email` = ? LIMIT 1", [body.email]))[0].length > 0) {
        throw new Error("Email already used by another user");
    }

    if ((await DB.execute<RowDataPacket[]>("SELECT * FROM `users` WHERE `pseudo` = ? LIMIT 1", [body.pseudo]))[0].length > 0) {
        throw new Error("Pseudo already used by another user");
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
    }
    catch {
        await DB.execute(
            "DELETE FROM `users` WHERE `id` = ?",
            [id],
        );

        throw new Error("Error while registration, please retry");
    }

    const verification_token = issueToken(mapAuthToken({ id: id }), id.toString(), "1h", true);

    await TRANSPORTER.sendMail({
        from   : ENV.smtp_user,
        to     : body.email,
        subject: `[${ENV.host}] - Verify your email`,
        text   : `Click this link to verify your email: https://api.${ENV.host}/auth/verify/${verification_token}. This link will expire in 1 hour.`,
    });

    return { code: 200, body: "User registered, please verify your email." };
}

export async function verifyEmail(token: string): Promise<ServiceResponse<string>> {
    if (!token) throw new Error("No token found");

    const { id } = verifyToken(token, mapAuthToken);

    if (id == -1) throw new Error("Invalid token");

    await DB.execute("UPDATE `users` SET `verified_email` = true WHERE `id` = ?", [id]);

    return { code: 200, body: "Email verified successfully." };
}

export async function login(body: BodyLogin): Promise<ServiceResponse<string>> {
    if (!isValidEmail(body.email_pseudo) && !isValidPseudo(body.email_pseudo)) {
        throw new Error("No email/pseudo given or bad format");
    }

    if (!isValidPassword(body.password)) {
        throw new Error("No password given or bad format (/^[\\w!#%*+/_~-]{12,64}$/)");
    }

    const [rows] = await DB.execute<RowDataPacket[]>(
        "SELECT * FROM `users` WHERE `email` = ? OR `pseudo` = ? LIMIT 1",
        [body.email_pseudo, body.email_pseudo],
    );

    if (rows.length === 0) throw new Error("User not found");

    const user = mapUser(rows[0] ?? {});

    if (!user.verified_email) throw new Error("Email not verified");

    const user_hashed_password = mapUserHashedPassword((await DB.execute<RowDataPacket[]>(
        "SELECT * FROM `users_hashed_pass` WHERE `user_id` = ?",
        [user.id],
    ))[0][0]);
    const is_match = await bcrypt.compare(body.password, user_hashed_password.hashed_pass);
    if (!is_match) throw new Error("Invalid password");

    const token = issueToken(mapAuthToken({ id: user.id }), user.id.toString(), "6h", false);

    return { code: 200, body: token };
}
