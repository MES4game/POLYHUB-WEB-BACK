import { RequestSuccess, RequestError } from "@/models/common.model";
import { Room, RoomFeature, mapLinkRoomFeature, mapRoom, mapRoomFeature } from "@/models/room.model";
import { mapLinkEventRoom } from "@/models/event.model";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";

export async function roomGetAll(): Promise<RequestSuccess<Room[]>> {
    const rooms = await dbSelect(mapRoom, "rooms");

    return new RequestSuccess(200, rooms);
}

export async function roomGetById(room_id: number): Promise<RequestSuccess<Room>> {
    if (room_id <= 0) {
        throw new RequestError(400, "Invalid room ID (must be non-negative)");
    }

    const [room] = await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id]);

    if (room === undefined || room.id === mapRoom.schema.id.default) {
        throw new RequestError(404, "Room not found");
    }

    return new RequestSuccess(200, room);
}

export async function roomPostCreate(building_id: number, name: string, description: string, capacity: number): Promise<RequestSuccess<Room>> {
    if (building_id <= 0) {
        throw new RequestError(400, "Invalid building ID (must be non-negative)");
    }

    if (name.trim().length === 0) {
        throw new RequestError(400, "Room name cannot be empty");
    }

    if (capacity < 0) {
        throw new RequestError(400, "Room capacity cannot be negative");
    }

    if ((await dbSelect(mapRoom, "buildings", "`id` = ?", 1, [building_id])).length === 0) {
        throw new RequestError(400, "Building does not exist");
    }

    if ((await dbSelect(mapRoom, "rooms", "`building_id` = ? AND `name` = ?", 1, [building_id, name.trim()])).length > 0) {
        throw new RequestError(409, "A room with the same name and building already exists");
    }

    const id = await dbInsert(
        "rooms",
        ["building_id", "name", "description", "capacity"],
        [building_id, name.trim(), description.trim(), capacity],
    );

    const [room] = await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [id]);

    if (room === undefined || room.id === mapRoom.schema.id.default) {
        throw new RequestError(500, "Failed to create room");
    }

    return new RequestSuccess(201, room);
}

export async function roomDeleteById(room_id: number): Promise<RequestSuccess> {
    if (room_id <= 0) {
        throw new RequestError(400, "Invalid room ID (must be non-negative)");
    }

    if ((await dbSelect(mapLinkEventRoom, "events_rooms", "`room_id` = ?", 1, [room_id])).length > 0) {
        throw new RequestError(409, "Cannot delete room with existing event links");
    }

    await dbDelete("rooms", "`id` = ?", [room_id]);

    return new RequestSuccess(204);
}

export async function roomPatchBuildingId(room_id: number, new_building_id: number): Promise<RequestSuccess> {
    if (room_id <= 0 || new_building_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapRoom, "buildings", "`id` = ?", 1, [new_building_id])).length === 0) {
        throw new RequestError(400, "New building does not exist");
    }

    const [room] = await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id]);

    if (room === undefined || room.id === mapRoom.schema.id.default) {
        throw new RequestError(404, "Room not found");
    }

    if ((await dbSelect(mapRoom, "rooms", "`building_id` = ? AND `name` = ?", 1, [new_building_id, room.name])).length > 0) {
        throw new RequestError(409, "A room with the same name already exists under the new building");
    }

    await dbUpdate("rooms", "`building_id` = ?", "`id` = ?", [new_building_id, room_id]);

    return new RequestSuccess(204);
}

export async function roomPatchName(room_id: number, new_name: string): Promise<RequestSuccess> {
    if (room_id <= 0) {
        throw new RequestError(400, "Invalid room ID (must be non-negative)");
    }

    if (new_name.trim().length === 0) {
        throw new RequestError(400, "Room name cannot be empty");
    }

    const [room] = await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id]);

    if (room === undefined || room.id === mapRoom.schema.id.default) {
        throw new RequestError(404, "Room not found");
    }

    if ((await dbSelect(mapRoom, "rooms", "`building_id` = ? AND `name` = ?", 1, [room.building_id, new_name.trim()])).length > 0) {
        throw new RequestError(409, "A room with the new name already exists under the same building");
    }

    await dbUpdate("rooms", "`name` = ?", "`id` = ?", [new_name.trim(), room_id]);

    return new RequestSuccess(204);
}

export async function roomPatchDescription(room_id: number, new_description: string): Promise<RequestSuccess> {
    if (room_id <= 0) {
        throw new RequestError(400, "Invalid room ID (must be non-negative)");
    }

    if ((await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id])).length === 0) {
        throw new RequestError(404, "Room not found");
    }

    await dbUpdate("rooms", "`description` = ?", "`id` = ?", [new_description.trim(), room_id]);

    return new RequestSuccess(204);
}

export async function roomPatchCapacity(room_id: number, new_capacity: number): Promise<RequestSuccess> {
    if (room_id <= 0) {
        throw new RequestError(400, "Invalid room ID (must be non-negative)");
    }

    if (new_capacity < 0) {
        throw new RequestError(400, "Room capacity cannot be negative");
    }

    if ((await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id])).length === 0) {
        throw new RequestError(404, "Room not found");
    }

    await dbUpdate("rooms", "`capacity` = ?", "`id` = ?", [new_capacity, room_id]);

    return new RequestSuccess(204);
}

export async function roomFeatureGetAll(): Promise<RequestSuccess<RoomFeature[]>> {
    const features = await dbSelect(mapRoomFeature, "room_features");

    return new RequestSuccess(200, features);
}

export async function roomFeatureGetById(room_feature_id: number): Promise<RequestSuccess<RoomFeature>> {
    if (room_feature_id <= 0) {
        throw new RequestError(400, "Invalid room feature ID (must be non-negative)");
    }

    const [feature] = await dbSelect(mapRoomFeature, "room_features", "`id` = ?", 1, [room_feature_id]);

    if (feature === undefined || feature.id === mapRoomFeature.schema.id.default) {
        throw new RequestError(404, "Room feature not found");
    }

    return new RequestSuccess(200, feature);
}

export async function roomFeaturePostCreate(name: string, description: string): Promise<RequestSuccess<RoomFeature>> {
    if (name.trim().length === 0) {
        throw new RequestError(400, "Room feature name cannot be empty");
    }

    if ((await dbSelect(mapRoomFeature, "room_features", "`name` = ?", 1, [name.trim()])).length > 0) {
        throw new RequestError(409, "A room feature with the same name already exists");
    }

    const id = await dbInsert(
        "room_features",
        ["name", "description"],
        [name.trim(), description.trim()],
    );

    const [feature] = await dbSelect(mapRoomFeature, "room_features", "`id` = ?", 1, [id]);

    if (feature === undefined || feature.id === mapRoomFeature.schema.id.default) {
        throw new RequestError(500, "Failed to create room feature");
    }

    return new RequestSuccess(201, feature);
}

export async function roomFeatureDeleteById(room_feature_id: number): Promise<RequestSuccess> {
    if (room_feature_id <= 0) {
        throw new RequestError(400, "Invalid room feature ID (must be non-negative)");
    }

    if ((await dbSelect(mapLinkRoomFeature, "rooms_room_features", "`room_feature_id` = ?", 1, [room_feature_id])).length > 0) {
        throw new RequestError(409, "Cannot delete room feature with existing room links");
    }

    await dbDelete("room_features", "`id` = ?", [room_feature_id]);

    return new RequestSuccess(204);
}

export async function roomFeaturePatchName(room_feature_id: number, new_name: string): Promise<RequestSuccess> {
    if (room_feature_id <= 0) {
        throw new RequestError(400, "Invalid room feature ID (must be non-negative)");
    }

    if (new_name.trim().length === 0) {
        throw new RequestError(400, "Room feature name cannot be empty");
    }

    if ((await dbSelect(mapRoomFeature, "room_features", "`name` = ?", 1, [new_name.trim()])).length > 0) {
        throw new RequestError(409, "A room feature with the new name already exists");
    }

    const [feature] = await dbSelect(mapRoomFeature, "room_features", "`id` = ?", 1, [room_feature_id]);

    if (feature === undefined || feature.id === mapRoomFeature.schema.id.default) {
        throw new RequestError(404, "Room feature not found");
    }

    await dbUpdate("room_features", "`name` = ?", "`id` = ?", [new_name.trim(), room_feature_id]);

    return new RequestSuccess(204);
}

export async function roomFeaturePatchDescription(room_feature_id: number, new_description: string): Promise<RequestSuccess> {
    if (room_feature_id <= 0) {
        throw new RequestError(400, "Invalid room feature ID (must be non-negative)");
    }

    if ((await dbSelect(mapRoomFeature, "room_features", "`id` = ?", 1, [room_feature_id])).length === 0) {
        throw new RequestError(404, "Room feature not found");
    }

    await dbUpdate("room_features", "`description` = ?", "`id` = ?", [new_description.trim(), room_feature_id]);

    return new RequestSuccess(204);
}

export async function roomGetLinkRoomfeature(room_id: number): Promise<RequestSuccess<{ features: number[] }>> {
    if (room_id <= 0) {
        throw new RequestError(400, "Invalid room ID (must be non-negative)");
    }

    if ((await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id])).length === 0) {
        throw new RequestError(404, "Room not found");
    }

    const links = await dbSelect(mapLinkRoomFeature, "rooms_room_features", "`room_id` = ?", 0, [room_id]);

    return new RequestSuccess(200, { features: links.map((link) => { return link.room_feature_id; }) });
}

export async function roomPostLinkRoomfeature(room_id: number, room_feature_id: number): Promise<RequestSuccess> {
    if (room_id <= 0 || room_feature_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id])).length === 0) {
        throw new RequestError(404, "Room not found");
    }

    if ((await dbSelect(mapRoomFeature, "room_features", "`id` = ?", 1, [room_feature_id])).length === 0) {
        throw new RequestError(404, "Room feature not found");
    }

    if ((await dbSelect(
        mapLinkRoomFeature,
        "rooms_room_features",
        "`room_id` = ? AND `room_feature_id` = ?",
        1,
        [room_id, room_feature_id],
    )).length > 0) {
        throw new RequestError(409, "Room feature is already linked to the room");
    }

    await dbInsert("rooms_room_features", ["room_id", "room_feature_id"], [room_id, room_feature_id]);

    return new RequestSuccess(204);
}

export async function roomDeleteLinkRoomfeature(room_id: number, room_feature_id: number): Promise<RequestSuccess> {
    if (room_id <= 0 || room_feature_id <= 0) {
        throw new RequestError(400, "Invalid ID (must be non-negative)");
    }

    if ((await dbSelect(mapRoom, "rooms", "`id` = ?", 1, [room_id])).length === 0) {
        throw new RequestError(404, "Room not found");
    }

    if ((await dbSelect(mapRoomFeature, "room_features", "`id` = ?", 1, [room_feature_id])).length === 0) {
        throw new RequestError(404, "Room feature not found");
    }

    if ((await dbSelect(
        mapLinkRoomFeature,
        "rooms_room_features",
        "`room_id` = ? AND `room_feature_id` = ?",
        1,
        [room_id, room_feature_id],
    )).length === 0) {
        throw new RequestError(409, "Room feature is not linked to the room");
    }

    await dbDelete("rooms_room_features", "`room_id` = ? AND `room_feature_id` = ?", [room_id, room_feature_id]);

    return new RequestSuccess(204);
}
