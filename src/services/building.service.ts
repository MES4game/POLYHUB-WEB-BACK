import { RequestSuccess, RequestError } from "@/models/common.model";
import { Building, mapBuilding } from "@/models/building.model";
import { mapRoom } from "@/models/room.model";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/utils/db.utils";

export async function buildingGetAll(): Promise<RequestSuccess<Building[]>> {
    const buildings = await dbSelect(mapBuilding, "buildings");

    return new RequestSuccess(200, buildings);
}

export async function buildingGetById(building_id: number): Promise<RequestSuccess<Building>> {
    if (building_id <= 0) {
        throw new RequestError(400, "Invalid building ID (must be non-negative)");
    }

    const [building] = await dbSelect(mapBuilding, "buildings", "`id` = ?", 1, [building_id]);

    if (building === undefined || building.id === mapBuilding.schema.id.default) {
        throw new RequestError(404, "Building not found");
    }

    return new RequestSuccess(200, building);
}

export async function buildingPostCreate(name: string, description: string): Promise<RequestSuccess<Building>> {
    if (name.trim().length === 0) {
        throw new RequestError(400, "Building name cannot be empty");
    }

    if ((await dbSelect(mapBuilding, "buildings", "`name` = ?", 1, [name.trim()])).length > 0) {
        throw new RequestError(409, "A building with the same name already exists");
    }

    const id = await dbInsert("buildings", ["name", "description"], [name.trim(), description.trim()]);

    const [building] = await dbSelect(mapBuilding, "buildings", "`id` = ?", 1, [id]);

    if (building === undefined || building.id === mapBuilding.schema.id.default) {
        throw new RequestError(500, "Failed to create building");
    }

    return new RequestSuccess(201, building);
}

export async function buildingDeleteById(building_id: number): Promise<RequestSuccess> {
    if (building_id <= 0) {
        throw new RequestError(400, "Invalid building ID (must be non-negative)");
    }

    if ((await dbSelect(mapRoom, "rooms", "`building_id` = ?", 1, [building_id])).length > 0) {
        throw new RequestError(409, "Cannot delete building with existing rooms");
    }

    await dbDelete("buildings", "`id` = ?", [building_id]);

    return new RequestSuccess(204);
}

export async function buildingPatchName(building_id: number, new_name: string): Promise<RequestSuccess> {
    if (building_id <= 0) {
        throw new RequestError(400, "Invalid building ID (must be non-negative)");
    }

    if (new_name.trim().length === 0) {
        throw new RequestError(400, "Building name cannot be empty");
    }

    if ((await dbSelect(mapBuilding, "buildings", "`name` = ?", 1, [new_name.trim()])).length > 0) {
        throw new RequestError(409, "A building with the new name already exists");
    }

    const [building] = await dbSelect(mapBuilding, "buildings", "`id` = ?", 1, [building_id]);

    if (building === undefined || building.id === mapBuilding.schema.id.default) {
        throw new RequestError(404, "Building not found");
    }

    await dbUpdate("buildings", "`name` = ?", "`id` = ?", [new_name.trim(), building_id]);

    return new RequestSuccess(204);
}

export async function buildingPatchDescription(building_id: number, new_description: string): Promise<RequestSuccess> {
    if (building_id <= 0) {
        throw new RequestError(400, "Invalid building ID (must be non-negative)");
    }

    if ((await dbSelect(mapBuilding, "buildings", "`id` = ?", 1, [building_id])).length === 0) {
        throw new RequestError(404, "Building not found");
    }

    await dbUpdate("buildings", "`description` = ?", "`id` = ?", [new_description.trim(), building_id]);

    return new RequestSuccess(204);
}

export async function buildingGetLinkRoom(building_id: number): Promise<RequestSuccess<{ rooms: number[] }>> {
    if (building_id <= 0) {
        throw new RequestError(400, "Invalid building ID (must be non-negative)");
    }

    if ((await dbSelect(mapBuilding, "buildings", "`id` = ?", 1, [building_id])).length === 0) {
        throw new RequestError(404, "Building not found");
    }

    const rooms = await dbSelect(mapRoom, "rooms", "`building_id` = ?", 0, [building_id]);

    return new RequestSuccess(200, { rooms: rooms.map((room) => { return room.id; }) });
}
