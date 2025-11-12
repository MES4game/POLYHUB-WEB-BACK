import { RequestSuccess, RequestError } from "@/models/common.model";
import { Lesson, LessonType, mapLesson, mapLessonType } from "@/models/lesson.model";
import { mapEvent } from "@/models/event.model";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";
import { LinkLessonGroup, mapLinkLessonGroup } from "@/models/group.model";

export async function lessonGetAll(): Promise<RequestSuccess<Lesson[]>> {
    const lessons = await dbSelect(mapLesson, "lessons");

    return new RequestSuccess(200, lessons);
}

export async function lessonGetById(lesson_id: number): Promise<RequestSuccess<Lesson>> {
    if (lesson_id <= 0) {
        throw new RequestError(400, "Invalid lesson ID (must be non-negative)");
    }

    const [lesson] = await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [lesson_id]);

    if (lesson === undefined || lesson.id === mapLesson.schema.id.default) {
        throw new RequestError(404, "Lesson not found");
    }

    return new RequestSuccess(200, lesson);
}

export async function lessonPostCreate(name: string, description: string, color: string): Promise<RequestSuccess<Lesson>> {
    if (name.trim().length === 0) {
        throw new RequestError(400, "Lesson name cannot be empty");
    }

    if (color.trim().length === 0) {
        throw new RequestError(400, "Lesson color cannot be empty");
    }

    if ((await dbSelect(mapLesson, "lessons", "`name` = ?", 1, [name.trim()])).length > 0) {
        throw new RequestError(409, "A lesson with the same name already exists");
    }

    const id = await dbInsert(
        "lessons",
        ["name", "description", "color"],
        [name.trim(), description.trim(), color.trim()],
    );

    const [lesson] = await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [id]);

    if (lesson === undefined || lesson.id === mapLesson.schema.id.default) {
        throw new RequestError(500, "Failed to create lesson");
    }

    return new RequestSuccess(201, lesson);
}

export async function lessonDeleteById(lesson_id: number): Promise<RequestSuccess> {
    if (lesson_id <= 0) {
        throw new RequestError(400, "Invalid lesson ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`lesson_id` = ?", 1, [lesson_id])).length > 0) {
        throw new RequestError(409, "Cannot delete lesson with existing event links");
    }

    await dbDelete("lessons", "`id` = ?", [lesson_id]);

    return new RequestSuccess(204);
}

export async function lessonPatchName(lesson_id: number, new_name: string): Promise<RequestSuccess> {
    if (lesson_id <= 0) {
        throw new RequestError(400, "Invalid lesson ID (must be non-negative)");
    }

    if (new_name.trim().length === 0) {
        throw new RequestError(400, "Lesson name cannot be empty");
    }

    if ((await dbSelect(mapLesson, "lessons", "`name` = ?", 1, [new_name.trim()])).length > 0) {
        throw new RequestError(409, "A lesson with the new name already exists");
    }

    const [lesson] = await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [lesson_id]);

    if (lesson === undefined || lesson.id === mapLesson.schema.id.default) {
        throw new RequestError(404, "Lesson not found");
    }

    await dbUpdate("lessons", "`name` = ?", "`id` = ?", [new_name.trim(), lesson_id]);

    return new RequestSuccess(204);
}

export async function lessonPatchDescription(lesson_id: number, new_description: string): Promise<RequestSuccess> {
    if (lesson_id <= 0) {
        throw new RequestError(400, "Invalid lesson ID (must be non-negative)");
    }

    if ((await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [lesson_id])).length === 0) {
        throw new RequestError(404, "Lesson not found");
    }

    await dbUpdate("lessons", "`description` = ?", "`id` = ?", [new_description.trim(), lesson_id]);

    return new RequestSuccess(204);
}

export async function lessonPatchColor(lesson_id: number, new_color: string): Promise<RequestSuccess> {
    if (lesson_id <= 0) {
        throw new RequestError(400, "Invalid lesson ID (must be non-negative)");
    }

    if (new_color.trim().length === 0) {
        throw new RequestError(400, "Lesson color cannot be empty");
    }

    if ((await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [lesson_id])).length === 0) {
        throw new RequestError(404, "Lesson not found");
    }

    await dbUpdate("lessons", "`color` = ?", "`id` = ?", [new_color.trim(), lesson_id]);

    return new RequestSuccess(204);
}

export async function lessonTypeGetAll(): Promise<RequestSuccess<LessonType[]>> {
    const lesson_types = await dbSelect(mapLessonType, "lesson_types");

    return new RequestSuccess(200, lesson_types);
}

export async function lessonTypeGetById(lesson_type_id: number): Promise<RequestSuccess<LessonType>> {
    if (lesson_type_id <= 0) {
        throw new RequestError(400, "Invalid lesson type ID (must be non-negative)");
    }

    const [lesson_type] = await dbSelect(mapLessonType, "lesson_types", "`id` = ?", 1, [lesson_type_id]);

    if (lesson_type === undefined || lesson_type.id === mapLessonType.schema.id.default) {
        throw new RequestError(404, "Lesson Type not found");
    }

    return new RequestSuccess(200, lesson_type);
}

export async function lessonTypePostCreate(name: string, description: string): Promise<RequestSuccess<LessonType>> {
    if (name.trim().length === 0) {
        throw new RequestError(400, "Lesson Type name cannot be empty");
    }

    if ((await dbSelect(mapLessonType, "lesson_types", "`name` = ?", 1, [name.trim()])).length > 0) {
        throw new RequestError(409, "A lesson type with the same name already exists");
    }

    const id = await dbInsert(
        "lesson_types",
        ["name", "description"],
        [name.trim(), description.trim()],
    );

    const [lesson_type] = await dbSelect(mapLessonType, "lesson_types", "`id` = ?", 1, [id]);

    if (lesson_type === undefined || lesson_type.id === mapLessonType.schema.id.default) {
        throw new RequestError(500, "Failed to create lesson type");
    }

    return new RequestSuccess(201, lesson_type);
}

export async function lessonTypeDeleteById(lesson_type_id: number): Promise<RequestSuccess> {
    if (lesson_type_id <= 0) {
        throw new RequestError(400, "Invalid lesson type ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`lesson_type_id` = ?", 1, [lesson_type_id])).length > 0) {
        throw new RequestError(409, "Cannot delete lesson type with existing event links");
    }

    await dbDelete("lesson_types", "`id` = ?", [lesson_type_id]);

    return new RequestSuccess(204);
}

export async function lessonTypePatchName(lesson_type_id: number, new_name: string): Promise<RequestSuccess> {
    if (lesson_type_id <= 0) {
        throw new RequestError(400, "Invalid lesson type ID (must be non-negative)");
    }

    if (new_name.trim().length === 0) {
        throw new RequestError(400, "Lesson Type name cannot be empty");
    }

    if ((await dbSelect(mapLessonType, "lesson_types", "`name` = ?", 1, [new_name.trim()])).length > 0) {
        throw new RequestError(409, "A lesson type with the new name already exists");
    }

    const [lesson_type] = await dbSelect(mapLessonType, "lesson_types", "`id` = ?", 1, [lesson_type_id]);

    if (lesson_type === undefined || lesson_type.id === mapLessonType.schema.id.default) {
        throw new RequestError(404, "Lesson Type not found");
    }

    await dbUpdate("lesson_types", "`name` = ?", "`id` = ?", [new_name.trim(), lesson_type_id]);

    return new RequestSuccess(204);
}

export async function lessonTypePatchDescription(lesson_type_id: number, new_description: string): Promise<RequestSuccess> {
    if (lesson_type_id <= 0) {
        throw new RequestError(400, "Invalid lesson type ID (must be non-negative)");
    }

    if ((await dbSelect(mapLessonType, "lesson_types", "`id` = ?", 1, [lesson_type_id])).length === 0) {
        throw new RequestError(404, "Lesson Type not found");
    }

    await dbUpdate("lesson_types", "`description` = ?", "`id` = ?", [new_description.trim(), lesson_type_id]);

    return new RequestSuccess(204);
}

export async function lessonGetLinkGroup(
    lesson_ids?: number | number[],
    lesson_type_ids?: number | number[],
    lesson_args?: number | number[],
): Promise<RequestSuccess<{ groups: number[] }>> {
    let where_filter = "";
    const params: unknown[] = [];

    if (lesson_ids !== undefined) {
        if (Array.isArray(lesson_ids) && lesson_ids.length > 0) {
            where_filter += "`lesson_id` IN (";

            lesson_ids.forEach(() => {
                where_filter += "?, ";
            });

            where_filter = where_filter.slice(0, -2) + ") AND ";
            params.push(...lesson_ids);
        }
        else if (!Array.isArray(lesson_ids)) {
            where_filter += `\`lesson_id\` = ? AND `;
            params.push(lesson_ids);
        }
    }

    if (lesson_type_ids !== undefined) {
        if (Array.isArray(lesson_type_ids) && lesson_type_ids.length > 0) {
            where_filter += "`lesson_type_id` IN (";

            lesson_type_ids.forEach(() => {
                where_filter += "?, ";
            });

            where_filter = where_filter.slice(0, -2) + ") AND ";
            params.push(...lesson_type_ids);
        }
        else if (!Array.isArray(lesson_type_ids)) {
            where_filter += `\`lesson_type_id\` = ? AND `;
            params.push(lesson_type_ids);
        }
    }

    if (lesson_args !== undefined) {
        if (Array.isArray(lesson_args) && lesson_args.length > 0) {
            where_filter += "`lesson_arg` IN (";

            lesson_args.forEach(() => {
                where_filter += "?, ";
            });

            where_filter = where_filter.slice(0, -2) + ") AND ";
            params.push(...lesson_args);
        }
        else if (!Array.isArray(lesson_args)) {
            where_filter += `\`lesson_arg\` = ? AND `;
            params.push(lesson_args);
        }
    }

    if (where_filter.length > 0) {
        where_filter = where_filter.slice(0, -5);
    }

    let links: LinkLessonGroup[] = [];

    if (where_filter.length > 0) {
        links = await dbSelect(mapLinkLessonGroup, "lessons_groups", where_filter, 0, params);
    }
    else {
        links = await dbSelect(mapLinkLessonGroup, "lessons_groups");
    }

    return new RequestSuccess(200, { groups: links.map((link) => { return link.group_id; }) });
}
