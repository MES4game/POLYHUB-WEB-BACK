import { RequestSuccess, RequestError } from "@/models/common.model";
import { Role, mapRole, mapLinkUserRole } from "@/models/role.model";
import { mapUser } from "@/models/user.model";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";

export async function roleGetAll(): Promise<RequestSuccess<Role[]>> {
    const roles = await dbSelect(mapRole, "roles");

    return new RequestSuccess(200, roles);
}

export async function roleGetById(role_id: number): Promise<RequestSuccess<Role>> {
    if (role_id <= 0) {
        throw new RequestError(400, "Invalid role ID (must be non-negative)");
    }

    const [role] = await dbSelect(mapRole, "roles", "`id` = ?", 1, [role_id]);

    if (role === undefined || role.id === mapRole.schema.id.default) {
        throw new RequestError(404, "Role not found");
    }

    return new RequestSuccess(200, role);
}

export async function rolePatchDescription(role_id: number, new_description: string): Promise<RequestSuccess> {
    if (role_id <= 0) {
        throw new RequestError(400, "Invalid role ID (must be non-negative)");
    }

    if ((await dbSelect(mapRole, "roles", "`id` = ?", 1, [role_id])).length === 0) {
        throw new RequestError(404, "Role not found");
    }

    await dbUpdate("roles", "`description` = ?", "`id` = ?", [new_description.trim(), role_id]);

    return new RequestSuccess(204);
}

export async function roleGetLinkUser(role_id: number): Promise<RequestSuccess<{ users: number[] }>> {
    if (role_id <= 0) {
        throw new RequestError(400, "Invalid role ID (must be non-negative)");
    }

    if ((await dbSelect(mapRole, "roles", "`id` = ?", 1, [role_id])).length === 0) {
        throw new RequestError(404, "Role not found");
    }

    const links = await dbSelect(mapLinkUserRole, "users_roles", "`role_id` = ?", 0, [role_id]);

    return new RequestSuccess(200, { users: links.map((link) => { return link.user_id; }) });
}

export async function rolePostLinkUser(role_name: "moderator" | "teacher", user_id: number): Promise<RequestSuccess> {
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

    if ((await dbSelect(mapLinkUserRole, "users_roles", "`user_id` = ? AND `role_id` = ?", 1, [user_id, role.id])).length > 0) {
        throw new RequestError(409, "User is already linked to the role");
    }

    await dbInsert("users_roles", ["user_id", "role_id"], [user_id, role.id]);

    return new RequestSuccess(204);
}

export async function roleDeleteLinkUser(role_name: "moderator" | "teacher", user_id: number): Promise<RequestSuccess> {
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

    if ((await dbSelect(mapLinkUserRole, "users_roles", "`user_id` = ? AND `role_id` = ?", 1, [user_id, role.id])).length === 0) {
        throw new RequestError(409, "User is not linked to the role");
    }

    await dbDelete("users_roles", "`user_id` = ? AND `role_id` = ?", [user_id, role.id]);

    return new RequestSuccess(204);
}
