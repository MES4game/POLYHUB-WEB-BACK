import { RequestSuccess, RequestError } from "@/models/common.model";
import { Event, mapEvent, mapLinkEventRoom, mapLinkEventUser } from "@/models/event.model";
import { mapLesson, mapLessonType } from "@/models/lesson.model";
import { mapRoom } from "@/models/room.model";
import { mapUser } from "@/models/user.model";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";

export async function eventGetAll(): Promise<RequestSuccess<Event[]>> {
    const events = await dbSelect(mapEvent, "events");

    return new RequestSuccess(200, events);
}

export async function eventGetAllFiltered(
    after_date?: Date,
    before_date?: Date,
    room_id?: number | number[],
    lesson_id?: null | number | number[],
    lesson_type_id?: null | number | number[],
    lesson_arg?: number | number[],
): Promise<RequestSuccess<Event[]>> {
    let where_filter = "";
    const params: unknown[] = [];

    if (after_date !== undefined) {
        where_filter += "(`start` >= ? OR `end` >= ?) AND ";
        params.push(after_date);
        params.push(after_date);
    }

    if (before_date !== undefined) {
        where_filter += "(`start` <= ? OR `end` <= ?) AND ";
        params.push(before_date);
        params.push(before_date);
    }

    if (lesson_id !== undefined) {
        if (Array.isArray(lesson_id) && lesson_id.length > 0) {
            where_filter += "`lesson_id` IN (";

            lesson_id.forEach(() => {
                where_filter += "?, ";
            });

            where_filter = where_filter.slice(0, -2) + ") AND ";
            params.push(...lesson_id);
        }
        else if (!Array.isArray(lesson_id)) {
            where_filter += `\`lesson_id\` ${lesson_id === null ? "IS NULL" : "= ?"} AND `;
            if (lesson_id !== null) params.push(lesson_id);
        }
    }

    if (lesson_type_id !== undefined) {
        if (Array.isArray(lesson_type_id) && lesson_type_id.length > 0) {
            where_filter += "`lesson_type_id` IN (";

            lesson_type_id.forEach(() => {
                where_filter += "?, ";
            });

            where_filter = where_filter.slice(0, -2) + ") AND ";
            params.push(...lesson_type_id);
        }
        else if (!Array.isArray(lesson_type_id)) {
            where_filter += `\`lesson_type_id\` ${lesson_type_id === null ? "IS NULL" : "= ?"} AND `;
            if (lesson_type_id !== null) params.push(lesson_type_id);
        }
    }

    if (lesson_arg !== undefined) {
        if (Array.isArray(lesson_arg) && lesson_arg.length > 0) {
            where_filter += "`lesson_arg` IN (";

            lesson_arg.forEach(() => {
                where_filter += "?, ";
            });

            where_filter = where_filter.slice(0, -2) + ") AND ";
            params.push(...lesson_arg);
        }
        else if (!Array.isArray(lesson_arg)) {
            where_filter += "`lesson_arg` = ? AND ";
            params.push(lesson_arg);
        }
    }

    if (where_filter.length > 0) {
        where_filter = where_filter.slice(0, -5);
    }

    let events: Event[] = [];

    if (where_filter.length > 0) {
        events = await dbSelect(mapEvent, "events", where_filter, 0, params);
    }
    else {
        events = await dbSelect(mapEvent, "events");
    }

    if (room_id !== undefined) {
        if (Array.isArray(room_id) && room_id.length > 0) {
            const links = await dbSelect(
                mapLinkEventRoom,
                "events_rooms",
                "`room_id` IN (" + room_id.map(() => { return "?"; }).join(", ") + ")",
                1,
                [...room_id],
            );

            events = events.filter((event) => {
                return links.some((link) => { return link.event_id === event.id; });
            });
        }
        else if (!Array.isArray(room_id)) {
            const links = await dbSelect(
                mapLinkEventRoom,
                "events_rooms",
                "`room_id` = ?",
                1,
                [room_id],
            );

            events = events.filter((event) => {
                return links.some((link) => { return link.event_id === event.id; });
            });
        }
    }

    return new RequestSuccess(200, events);
}

export async function eventGetById(event_id: number): Promise<RequestSuccess<Event>> {
    if (event_id <= 0) {
        throw new RequestError(400, "Invalid event ID (must be non-negative)");
    }

    const [event] = await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id]);

    if (event === undefined || event.id === mapEvent.schema.id.default) {
        throw new RequestError(404, "Event not found");
    }

    return new RequestSuccess(200, event);
}

export async function eventPostCreate(
    start: Date,
    end: Date,
    lesson_id: null | number,
    lesson_type_id: null | number,
    lesson_arg = 0,
): Promise<RequestSuccess<Event>> {
    if (start >= end) {
        throw new RequestError(400, "Event start time must be before end time");
    }

    if ((await dbSelect(
        mapEvent,
        "events",
        `((\`start\` BETWEEN ? AND ?) OR (\`end\` BETWEEN ? AND ?)) AND \`lesson_id\` ${lesson_id === null ? "IS" : "="} ? AND \`lesson_type_id\` ${lesson_type_id === null ? "IS" : "="} ? AND \`lesson_arg\` = ?`,
        1,
        [start, end, start, end, lesson_id, lesson_type_id, lesson_arg],
    )).length > 0) {
        throw new RequestError(409, "An event with the same parameters already exists");
    }

    const id = await dbInsert(
        "events",
        ["start", "end", "lesson_id", "lesson_type_id", "lesson_arg"],
        [start, end, lesson_id, lesson_type_id, lesson_arg],
    );

    const [event] = await dbSelect(mapEvent, "events", "`id` = ?", 1, [id]);

    if (event === undefined || event.id === mapEvent.schema.id.default) {
        throw new RequestError(500, "Failed to create event");
    }

    return new RequestSuccess(201, event);
}

export async function eventDeleteById(event_id: number): Promise<RequestSuccess> {
    if (event_id <= 0) {
        throw new RequestError(400, "Invalid event ID (must be non-negative)");
    }

    await dbDelete("events", "`id` = ?", [event_id]);

    return new RequestSuccess(204);
}

export async function eventPatch(
    event_id: number,
    new_start?: Date,
    new_end?: Date,
    new_lesson_id?: null | number,
    new_lesson_type_id?: null | number,
    new_lesson_arg = -1,
): Promise<RequestSuccess> {
    if (new_start === undefined
        && new_end === undefined
        && new_lesson_id === undefined
        && new_lesson_type_id === undefined
        && new_lesson_arg === -1
    ) {
        throw new RequestError(400, "No fields to update");
    }

    if (event_id <= 0
        || (new_lesson_id !== undefined && new_lesson_id !== null && new_lesson_id <= 0)
        || (new_lesson_type_id !== undefined && new_lesson_type_id !== null && new_lesson_type_id <= 0)
    ) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    const [event] = await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id]);

    if (event === undefined || event.id === mapEvent.schema.id.default) {
        throw new RequestError(404, "Event not found");
    }

    new_start ??= event.start;
    new_end ??= event.end;

    if (new_lesson_id === undefined) {
        new_lesson_id = event.lesson_id;
    }

    if (new_lesson_type_id === undefined) {
        new_lesson_type_id = event.lesson_type_id;
    }

    if (new_lesson_arg === -1) {
        new_lesson_arg = event.lesson_arg;
    }

    if (new_start >= new_end) {
        throw new RequestError(400, "Event start time must be before end time");
    }

    if (new_lesson_id !== null && (await dbSelect(mapLesson, "lessons", "`id` = ?", 1, [new_lesson_id])).length === 0) {
        throw new RequestError(404, "Lesson not found");
    }

    if (new_lesson_type_id !== null && (await dbSelect(mapLessonType, "lesson_types", "`id` = ?", 1, [new_lesson_type_id])).length === 0) {
        throw new RequestError(404, "Lesson type not found");
    }

    if ((await dbSelect(
        mapEvent,
        "events",
        `\`id\` != ? AND ((\`start\` BETWEEN ? AND ?) OR (\`end\` BETWEEN ? AND ?)) AND \`lesson_id\` ${new_lesson_id === null ? "IS" : "="} ? AND \`lesson_type_id\` ${new_lesson_type_id === null ? "IS" : "="} ? AND \`lesson_arg\` = ?`,
        1,
        [event_id, new_start, new_end, new_start, new_end, new_lesson_id, new_lesson_type_id, new_lesson_arg],
    )).length > 0) {
        throw new RequestError(409, "An event with the same lesson already exists in the specified time range");
    }

    const rooms = await dbSelect(
        mapLinkEventRoom,
        "events_rooms",
        "`event_id` = ?",
        0,
        [event_id],
    );

    for (const link of rooms) {
        const conflicting_events = await dbSelect(
            mapEvent,
            "events",
            "`id` != ? AND ((`start` BETWEEN ? AND ?) OR (`end` BETWEEN ? AND ?)) AND `id` IN (SELECT `event_id` FROM `events_rooms` WHERE `room_id` = ?)",  // eslint-disable-line @stylistic/max-len
            1,
            [event_id, new_start, new_end, new_start, new_end, link.room_id],
        );

        if (conflicting_events.length > 0) {
            throw new RequestError(409, `Time conflict with another event in room ID ${link.room_id.toString()}`);
        }
    }

    await dbUpdate(
        "events",
        "`start` = ?, `end` = ?, `lesson_id` = ?, `lesson_type_id` = ?, `lesson_arg` = ?",
        "`id` = ?",
        [new_start, new_end, new_lesson_id, new_lesson_type_id, new_lesson_arg, event_id],
    );

    return new RequestSuccess(204);
}

export async function eventGetLinkRoom(
    event_id: number,
): Promise<RequestSuccess<{ rooms: number[] }>> {
    if (event_id <= 0) {
        throw new RequestError(400, "Invalid event ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id])).length === 0) {
        throw new RequestError(404, "Event not found");
    }

    const links = await dbSelect(mapLinkEventRoom, "events_rooms", "`event_id` = ?", 0, [event_id]);

    return new RequestSuccess(200, { rooms: links.map((link) => { return link.room_id; }) });
}

export async function eventPostLinkRoom(event_id: number, room_id: number): Promise<RequestSuccess> {
    if (event_id <= 0 || room_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id])).length === 0) {
        throw new RequestError(404, "Event not found");
    }

    if ((await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id])).length === 0) {
        throw new RequestError(404, "Room not found");
    }

    if ((await dbSelect(mapLinkEventRoom, "events_rooms", "`event_id` = ? AND `room_id` = ?", 1, [event_id, room_id])).length > 0) {
        throw new RequestError(409, "Room is already linked to the event");
    }

    await dbInsert("events_rooms", ["event_id", "room_id"], [event_id, room_id]);

    return new RequestSuccess(204);
}

export async function eventDeleteLinkRoom(event_id: number, room_id: number): Promise<RequestSuccess> {
    if (event_id <= 0 || room_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id])).length === 0) {
        throw new RequestError(404, "Event not found");
    }

    if ((await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id])).length === 0) {
        throw new RequestError(404, "Room not found");
    }

    if ((await dbSelect(mapLinkEventRoom, "events_rooms", "`event_id` = ? AND `room_id` = ?", 1, [event_id, room_id])).length === 0) {
        throw new RequestError(409, "Room is not linked to the event");
    }

    await dbDelete("events_rooms", "`event_id` = ? AND `room_id` = ?", [event_id, room_id]);

    return new RequestSuccess(204);
}

export async function eventGetLinkUser(
    event_id: number,
): Promise<RequestSuccess<{ users: number[] }>> {
    if (event_id <= 0) {
        throw new RequestError(400, "Invalid event ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id])).length === 0) {
        throw new RequestError(404, "Event not found");
    }

    const links = await dbSelect(mapLinkEventUser, "events_users", "`event_id` = ?", 0, [event_id]);

    return new RequestSuccess(200, { users: links.map((link) => { return link.user_id; }) });
}

export async function eventPostLinkUser(event_id: number, user_id: number): Promise<RequestSuccess> {
    if (event_id <= 0 || user_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id])).length === 0) {
        throw new RequestError(404, "Event not found");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    if ((await dbSelect(mapLinkEventUser, "events_users", "`event_id` = ? AND `user_id` = ?", 1, [event_id, user_id])).length > 0) {
        throw new RequestError(409, "User is already linked to the event");
    }

    await dbInsert("events_users", ["event_id", "user_id"], [event_id, user_id]);

    return new RequestSuccess(204);
}

export async function eventDeleteLinkUser(event_id: number, user_id: number): Promise<RequestSuccess> {
    if (event_id <= 0 || user_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapEvent, "events", "`id` = ?", 1, [event_id])).length === 0) {
        throw new RequestError(404, "Event not found");
    }

    if ((await dbSelect(mapUser, "users", "`id` = ?", 1, [user_id])).length === 0) {
        throw new RequestError(404, "User not found");
    }

    if ((await dbSelect(mapLinkEventUser, "events_users", "`event_id` = ? AND `user_id` = ?", 1, [event_id, user_id])).length === 0) {
        throw new RequestError(409, "User is not linked to the event");
    }

    await dbDelete("events_users", "`event_id` = ? AND `user_id` = ?", [event_id, user_id]);

    return new RequestSuccess(204);
}
