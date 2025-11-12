import { RequestSuccess, RequestError } from "@/models/common.model";
import { Group, mapGroup, mapLinkUserGroup, mapLinkLessonGroup } from "@/models/group.model";
import { mapLesson, mapLessonType } from "@/models/lesson.model";
import { mapUser } from "@/models/user.model";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";

export async function groupGetAll(): Promise<RequestSuccess<Group[]>> {
    const groups = await dbSelect(mapGroup, "groups");

    return new RequestSuccess(200, groups);
}

export async function groupGetById(group_id: number): Promise<RequestSuccess<Group>> {
    if (group_id <= 0) {
        throw new RequestError(400, "Invalid group ID (must be non-negative)");
    }

    const [group] = await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id]);

    if (group === undefined || group.id === mapGroup.schema.id.default) {
        throw new RequestError(404, "Group not found");
    }

    return new RequestSuccess(200, group);
}

export async function groupGetChildren(parent_id: null | number): Promise<RequestSuccess<Group[]>> {
    if (parent_id !== null && parent_id <= 0) {
        throw new RequestError(400, "Invalid group ID (must be non-negative)");
    }

    if (parent_id !== null) {
        const [group] = await dbSelect(mapGroup, "groups", "`id` = ?", 1, [parent_id]);

        if (group === undefined || group.id === mapGroup.schema.id.default) {
            throw new RequestError(404, "Parent group not found");
        }
    }

    const groups = await dbSelect(mapGroup, "groups", `\`parent_id\` ${parent_id === null ? "IS" : "="} ?`, 0, [parent_id]);

    return new RequestSuccess(200, groups);
}

export async function groupPostCreate(parent_id: null | number, name: string, description: string): Promise<RequestSuccess<Group>> {
    if (parent_id !== null && parent_id <= 0) {
        throw new RequestError(400, "Invalid parent group ID (must be non-negative)");
    }

    if (name.trim().length === 0) {
        throw new RequestError(400, "Group name cannot be empty");
    }

    if (parent_id !== null && (await dbSelect(mapGroup, "groups", "`id` = ?", 1, [parent_id])).length === 0) {
        throw new RequestError(400, "Parent group does not exist");
    }

    if ((await dbSelect(
        mapGroup,
        "groups",
        `\`parent_id\` ${parent_id === null ? "IS" : "="} ? AND \`name\` = ?`,
        1,
        [parent_id, name.trim()]
    )).length > 0) {
        throw new RequestError(409, "A group with the same name and parent already exists");
    }

    const id = await dbInsert("groups", ["parent_id", "name", "description"], [parent_id, name.trim(), description.trim()]);

    const [group] = await dbSelect(mapGroup, "groups", "`id` = ?", 1, [id]);

    if (group === undefined || group.id === mapGroup.schema.id.default) {
        throw new RequestError(500, "Failed to create group");
    }

    return new RequestSuccess(201, group);
}

export async function groupDeleteById(group_id: number): Promise<RequestSuccess> {
    if (group_id <= 0) {
        throw new RequestError(400, "Invalid group ID (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`parent_id` = ?", 1, [group_id])).length > 0) {
        throw new RequestError(409, "Cannot delete group with existing subgroups");
    }

    if ((await dbSelect(mapLinkUserGroup, "users_groups", "`group_id` = ?", 1, [group_id])).length > 0) {
        throw new RequestError(409, "Cannot delete group with existing user links");
    }

    await dbDelete("groups", "`id` = ?", [group_id]);

    return new RequestSuccess(204);
}

export async function groupPatchParentId(group_id: number, new_parent_id: null | number): Promise<RequestSuccess> {
    if (group_id <= 0 || (new_parent_id !== null && new_parent_id <= 0)) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if (group_id === new_parent_id) {
        throw new RequestError(400, "A group cannot be its own parent");
    }

    if (new_parent_id !== null && (await dbSelect(mapGroup, "groups", "`id` = ?", 1, [new_parent_id])).length === 0) {
        throw new RequestError(400, "New parent group does not exist");
    }

    const [group] = await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id]);

    if (group === undefined || group.id === mapGroup.schema.id.default) {
        throw new RequestError(404, "Group not found");
    }

    if ((await dbSelect(
        mapGroup,
        "groups",
        `\`parent_id\` ${new_parent_id === null ? "IS" : "="} ? AND \`name\` = ?`,
        1,
        [new_parent_id, group.name]
    )).length > 0) {
        throw new RequestError(409, "A group with the same name already exists under the new parent");
    }

    await dbUpdate("groups", "`parent_id` = ?", "`id` = ?", [new_parent_id, group_id]);

    return new RequestSuccess(204);
}

export async function groupPatchName(group_id: number, new_name: string): Promise<RequestSuccess> {
    if (group_id <= 0) {
        throw new RequestError(400, "Invalid group ID (must be non-negative)");
    }

    if (new_name.trim().length === 0) {
        throw new RequestError(400, "Group name cannot be empty");
    }

    const [group] = await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id]);

    if (group === undefined || group.id === mapGroup.schema.id.default) {
        throw new RequestError(404, "Group not found");
    }

    if ((await dbSelect(mapGroup, "groups", "`parent_id` = ? AND `name` = ?", 1, [group.parent_id, new_name.trim()])).length > 0) {
        throw new RequestError(409, "A group with the new name already exists under the same parent");
    }

    await dbUpdate("groups", "`name` = ?", "`id` = ?", [new_name.trim(), group_id]);

    return new RequestSuccess(204);
}

export async function groupPatchDescription(group_id: number, new_description: string): Promise<RequestSuccess> {
    if (group_id <= 0) {
        throw new RequestError(400, "Invalid group ID (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id])).length === 0) {
        throw new RequestError(404, "Group not found");
    }

    await dbUpdate("groups", "`description` = ?", "`id` = ?", [new_description.trim(), group_id]);

    return new RequestSuccess(204);
}

export async function groupGetLinkUser(group_id: number): Promise<RequestSuccess<{ users: number[] }>> {
    if (group_id <= 0) {
        throw new RequestError(400, "Invalid group ID (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id])).length === 0) {
        throw new RequestError(404, "Group not found");
    }

    const links = await dbSelect(mapLinkUserGroup, "users_groups", "`group_id` = ?", 0, [group_id]);

    return new RequestSuccess(200, { users: links.map((link) => { return link.user_id; }) });
}

export async function groupPostLinkUser(group_id: number, user_id: number): Promise<RequestSuccess> {
    if (group_id <= 0 || user_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id])).length === 0) {
        throw new RequestError(404, "Group not found");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    if ((await dbSelect(mapLinkUserGroup, "users_groups", "`user_id` = ? AND `group_id` = ?", 1, [user_id, group_id])).length > 0) {
        throw new RequestError(409, "User is already linked to the group");
    }

    await dbInsert("users_groups", ["user_id", "group_id"], [user_id, group_id]);

    return new RequestSuccess(204);
}

export async function groupDeleteLinkUser(group_id: number, user_id: number): Promise<RequestSuccess> {
    if (group_id <= 0 || user_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id])).length === 0) {
        throw new RequestError(404, "Group not found");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    if ((await dbSelect(mapLinkUserGroup, "users_groups", "`user_id` = ? AND `group_id` = ?", 1, [user_id, group_id])).length === 0) {
        throw new RequestError(409, "User is not linked to the group");
    }

    await dbDelete("users_groups", "`user_id` = ? AND `group_id` = ?", [user_id, group_id]);

    return new RequestSuccess(204);
}

export async function groupGetLinkLesson(
    group_id: number,
): Promise<RequestSuccess<{ lessons: { lesson: number; lesson_type: number; lesson_arg: number }[] }>> {
    if (group_id <= 0) {
        throw new RequestError(400, "Invalid group ID (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id])).length === 0) {
        throw new RequestError(404, "Group not found");
    }

    const links = await dbSelect(mapLinkLessonGroup, "lessons_groups", "`group_id` = ?", 0, [group_id]);

    return new RequestSuccess(
        200,
        {
            lessons: links.map((link) => {
                return {
                    lesson     : link.lesson_id,
                    lesson_type: link.lesson_type_id,
                    lesson_arg : link.lesson_arg,
                };
            }),
        },
    );
}

export async function groupPostLinkLesson(group_id: number, lesson_id: number, lesson_type_id: number, lesson_arg: number): Promise<RequestSuccess> {
    if (group_id <= 0 || lesson_id <= 0 || lesson_type_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if (lesson_arg < 0) {
        throw new RequestError(400, "Invalid lesson argument (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id])).length === 0) {
        throw new RequestError(404, "Group not found");
    }

    if ((await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [lesson_id])).length === 0) {
        throw new RequestError(404, "Lesson not found");
    }

    if ((await dbSelect(mapLessonType, "lesson_types", "`id` = ?", 1, [lesson_type_id])).length === 0) {
        throw new RequestError(404, "Lesson type not found");
    }

    if ((await dbSelect(
        mapLinkLessonGroup,
        "lessons_groups",
        "`lesson_id` = ? AND `lesson_type_id` = ? AND `lesson_arg` = ? AND `group_id` = ?",
        1,
        [lesson_id, lesson_type_id, lesson_arg, group_id],
    )).length > 0) {
        throw new RequestError(409, "Lesson is already linked to the group");
    }

    await dbInsert(
        "lessons_groups",
        ["lesson_id", "lesson_type_id", "lesson_arg", "group_id"],
        [lesson_id, lesson_type_id, lesson_arg, group_id],
    );

    return new RequestSuccess(204);
}

export async function groupDeleteLinkLesson(
    group_id: number,
    lesson_id: number,
    lesson_type_id: number,
    lesson_arg: number,
): Promise<RequestSuccess> {
    if (group_id <= 0 || lesson_id <= 0 || lesson_type_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if (lesson_arg < 0) {
        throw new RequestError(400, "Invalid lesson argument (must be non-negative)");
    }

    if ((await dbSelect(mapGroup, "groups", "`id` = ?", 1, [group_id])).length === 0) {
        throw new RequestError(404, "Group not found");
    }

    if ((await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [lesson_id])).length === 0) {
        throw new RequestError(404, "Lesson not found");
    }

    if ((await dbSelect(mapLessonType, "lesson_types", "`id` = ?", 1, [lesson_type_id])).length === 0) {
        throw new RequestError(404, "Lesson type not found");
    }

    if ((await dbSelect(
        mapLinkLessonGroup,
        "lessons_groups",
        "`lesson_id` = ? AND `lesson_type_id` = ? AND `lesson_arg` = ? AND `group_id` = ?",
        1,
        [lesson_id, lesson_type_id, lesson_arg, group_id],
    )).length === 0) {
        throw new RequestError(409, "Lesson is not linked to the group");
    }

    await dbDelete(
        "lessons_groups",
        "`lesson_id` = ? AND `lesson_type_id` = ? AND `lesson_arg` = ? AND `group_id` = ?",
        [lesson_id, lesson_type_id, lesson_arg, group_id],
    );

    return new RequestSuccess(204);
}
