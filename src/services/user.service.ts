import bcrypt from "bcryptjs";
import { User, mapPatchPasswordToken, mapUser, mapUserHashedPassword } from "@/models/user.model";
import { RequestSuccess, RequestError } from "@/models/common.model";
import { issueToken, verifyToken } from "@/config/jwt.config";
import { TRANSPORTER } from "@/config/mail.config";
import { ENV } from "@/config/env.config";
import { isValidEmail, isValidPassword, isValidPseudo } from "@/utils/regex.util";
import { mapLinkUserRole, mapRole } from "@/models/role.model";
import { dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";
import { mapLinkUserGroup } from "@/models/group.model";
import { mapLinkEventUser } from "@/models/event.model";

export async function userGetAll(): Promise<RequestSuccess<User[]>> {
    const users = await dbSelect(mapUser, "users");

    return new RequestSuccess(200, users);
}

export async function userGetById(user_id: number): Promise<RequestSuccess<User>> {
    if (user_id <= 0) {
        throw new RequestError(400, "Invalid user ID (must be non-negative)");
    }

    const [user] = await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id]);

    if (user === undefined || user.id === mapUser.schema.id.default) {
        throw new RequestError(404, "User not found");
    }

    return new RequestSuccess(200, user);
}

export async function userPatchPseudo(new_pseudo: string, current_user?: User): Promise<RequestSuccess> {
    if (current_user === undefined || current_user.id === mapUser.schema.id.default) {
        throw new RequestError(404, "User not found");
    }

    if (!isValidPseudo(new_pseudo.trim())) {
        throw new RequestError(400, "Pseudo cannot be empty");
    }

    if ((await dbSelect(mapUser, "users", "`pseudo` = ?", 1, [new_pseudo.trim()])).length > 0) {
        throw new RequestError(409, "A user with this pseudo already exists");
    }

    await dbUpdate("users", "`pseudo` = ?", "`id` = ?", [new_pseudo.trim(), current_user.id]);

    return new RequestSuccess(204);
}

export async function userPatchFirstname(new_firstname: string, current_user?: User): Promise<RequestSuccess> {
    if (current_user === undefined || current_user.id === mapUser.schema.id.default) {
        throw new RequestError(404, "User not found");
    }

    if (new_firstname.trim().length === 0) {
        throw new RequestError(400, "Firstname cannot be empty");
    }

    await dbUpdate("users", "`firstname` = ?", "`id` = ?", [new_firstname.trim(), current_user.id]);

    return new RequestSuccess(204);
}

export async function userPatchLastname(new_lastname: string, current_user?: User): Promise<RequestSuccess> {
    if (current_user === undefined || current_user.id === mapUser.schema.id.default) {
        throw new RequestError(404, "User not found");
    }

    if (new_lastname.trim().length === 0) {
        throw new RequestError(400, "Lastname cannot be empty");
    }

    await dbUpdate("users", "`lastname` = ?", "`id` = ?", [new_lastname.trim(), current_user.id]);

    return new RequestSuccess(204);
}

export async function userPostResetPassword(email: string): Promise<RequestSuccess> {
    if (!isValidEmail(email.trim())) {
        throw new RequestError(400, "No email given or bad format");
    }

    const [user] = await dbSelect(mapUser, "users", "`email` = ?", 1, [email.trim()]);

    if (user === undefined || user.id === mapUser.schema.id.default) {
        throw new RequestError(404, "User not found");
    }

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
    if (!token) {
        throw new RequestError(400, "No token found");
    }

    if (!isValidPassword(new_password)) {
        throw new RequestError(400, "No password given or bad format (/^[\\w!#%*+/_~-]{12,64}$/)");
    }

    const { id } = verifyToken(token, mapPatchPasswordToken);

    if (id === mapPatchPasswordToken.schema.id.default) {
        throw new RequestError(401, "Invalid token");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    if ((await dbSelect(mapUserHashedPassword, "users_hashed_pass", "`user_id` = ?", 1, [id])).length === 0) {
        await dbInsert(
            "users_hashed_pass",
            ["user_id", "hashed_pass"],
            [id, await bcrypt.hash(new_password, 15)],
        );
    }
    else {
        await dbUpdate("users_hashed_pass", "`hashed_pass` = ?", "`user_id` = ?", [await bcrypt.hash(new_password, 15), id]);
    }

    return new RequestSuccess(204);
}

export async function userGetIsRole(role_name: "admin" | "moderator" | "teacher", user_id: number): Promise<RequestSuccess<{ is_role: boolean }>> {
    if (user_id <= 0) {
        throw new RequestError(400, "Invalid user ID (must be non-negative)");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    const [role] = await dbSelect(mapRole, "roles", "`name` = ?", 1, [role_name]);

    if (role === undefined || role.id === mapRole.schema.id.default) {
        throw new RequestError(500, `${role_name} role not found`);
    }

    const links = await dbSelect(mapLinkUserRole, "users_roles", "`user_id` = ? AND `role_id` = ?", 1, [user_id, role.id]);

    return new RequestSuccess(200, { is_role: links.length > 0 });
}

export async function userGetLinkRole(user_id: number): Promise<RequestSuccess<{ roles: number[] }>> {
    if (user_id <= 0) {
        throw new RequestError(400, "Invalid user ID (must be non-negative)");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    const links = await dbSelect(mapLinkUserRole, "users_roles", "`user_id` = ?", 0, [user_id]);

    return new RequestSuccess(200, { roles: links.map((link) => { return link.role_id; }) });
}

export async function userGetLinkGroup(user_id: number): Promise<RequestSuccess<{ groups: number[] }>> {
    if (user_id <= 0) {
        throw new RequestError(400, "Invalid user ID (must be non-negative)");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    const links = await dbSelect(mapLinkUserGroup, "users_roles", "`user_id` = ?", 0, [user_id]);

    return new RequestSuccess(200, { groups: links.map((link) => { return link.group_id; }) });
}

export async function userGetLinkEvent(user_id: number): Promise<RequestSuccess<{ events: number[] }>> {
    if (user_id <= 0) {
        throw new RequestError(400, "Invalid user ID (must be non-negative)");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    const links = await dbSelect(mapLinkEventUser, "events_users", "`user_id` = ?", 0, [user_id]);

    return new RequestSuccess(200, { events: links.map((link) => { return link.event_id; }) });
}
