import bcrypt from "bcryptjs";
import { ENV } from "@/config/env.config";
import { TRANSPORTER } from "@/config/mail.config";
import { issueToken, verifyToken } from "@/config/jwt.config";
import { RequestSuccess, RequestError } from "@/models/common.model";
import { mapAuthToken } from "@/models/auth.model";
import { mapUser, mapUserHashedPassword } from "@/models/user.model";
import { isValidEmail, isValidPassword, isValidPseudo } from "@/utils/regex.util";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";

export async function authPostRegister(
    email: string,
    pseudo: string,
    firstname: string,
    lastname: string,
    password: string,
): Promise<RequestSuccess> {
    if (!isValidEmail(email.trim())) {
        throw new RequestError(400, "No email given or bad format");
    }

    if (!isValidPseudo(pseudo.trim())) {
        throw new RequestError(400, "No pseudo given or bad format (4-64 characters and /^[\\w!#$%&'*+/=?^_`{|}~-]+$/)");
    }

    if (!isValidPassword(password)) {
        throw new RequestError(400, "No password given or bad format (12-64 characters and /^[\\w!#%*+/_~-]{12,64}$/)");
    }

    if (firstname.trim().length < 1 || firstname.trim().length > 64) {
        throw new RequestError(400, "No firstname given or bad format (1-64 characters)");
    }

    if (lastname.trim().length < 1 || lastname.trim().length > 64) {
        throw new RequestError(400, "No lastname given or bad format (1-64 characters)");
    }

    if ((await dbSelect(mapUser, "users", "`email` = ?", 1, [email.trim()])).length > 0) {
        throw new RequestError(409, "Email already used by another user");
    }

    if ((await dbSelect(mapUser, "users", "`pseudo` = ?", 1, [pseudo.trim()])).length > 0) {
        throw new RequestError(409, "Pseudo already used by another user");
    }

    const id = await dbInsert(
        "users",
        ["email", "pseudo", "firstname", "lastname"],
        [email.trim(), pseudo.trim(), firstname.trim(), lastname.trim()],
    );

    try {
        await dbInsert(
            "users_hashed_pass",
            ["user_id", "hashed_pass"],
            [id, await bcrypt.hash(password, 15)],
        );

        const verification_token = issueToken(mapAuthToken({ id: id }), id.toString(), "1h", true);

        await TRANSPORTER.sendMail({
            from   : ENV.smtp_user,
            to     : email.trim(),
            subject: `[${ENV.host}] - Verify your email`,
            text   : `Click this link to verify your email: https://${ENV.host}/auth/verifyEmail/${verification_token}. This link will expire in 1 hour.`,
        });
    }
    catch(err) {
        await dbDelete("users", "`id` = ?", [id]);

        throw new RequestError(500, "Error while registering user: " + (err as Error).message);
    }

    return new RequestSuccess(204);
}

export async function authGetVerifyEmail(token: string): Promise<RequestSuccess> {
    if (!token) {
        throw new RequestError(400, "No token found");
    }

    const { id } = verifyToken(token, mapAuthToken);

    if (id === mapAuthToken.schema.id.default) {
        throw new RequestError(401, "Invalid token");
    }

    await dbUpdate("users", "`verified_email` = TRUE", "`id` = ?", [id]);

    return new RequestSuccess(204);
}

export async function authPostLogin(
    user_login: string,
    password: string,
): Promise<RequestSuccess<{ token: string }>> {
    if (!isValidEmail(user_login.trim()) && !isValidPseudo(user_login.trim())) {
        throw new RequestError(400, "No email/pseudo given or bad format");
    }

    if (!isValidPassword(password)) {
        throw new RequestError(400, "No password given or bad format");
    }

    const [user] = await dbSelect(mapUser, "users", "`email` = ? OR `pseudo` = ?", 1, [user_login.trim(), user_login.trim()]);

    if (user === undefined || user.id === mapUser.schema.id.default) {
        throw new RequestError(401, "Invalid credentials");
    }

    if (!user.verified_email) {
        throw new RequestError(403, "Email not verified");
    }

    const [user_hashed_password] = await dbSelect(
        mapUserHashedPassword,
        "users_hashed_pass",
        "`user_id` = ?",
        1,
        [user.id],
    );

    if (user_hashed_password === undefined || user_hashed_password.user_id === mapUserHashedPassword.schema.user_id.default) {
        throw new RequestError(500, "User hashed password not found");
    }

    if (!await bcrypt.compare(password, user_hashed_password.hashed_pass)) {
        throw new RequestError(401, "Invalid credentials");
    }

    const token = issueToken(mapAuthToken({ id: user.id }), user.id.toString(), "6h", false);

    return new RequestSuccess(200, { token: token });
}
