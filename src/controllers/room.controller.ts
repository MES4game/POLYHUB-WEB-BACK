import { Controller, Route, Tags, Get, Post, Delete, Patch, Security, Path, Body } from "tsoa";
import { Room, RoomFeature } from "../models/room.model";
import {
    roomGetAll,
    roomGetById,
    roomPostCreate,
    roomDeleteById,
    roomPatchBuildingId,
    roomPatchName,
    roomPatchDescription,
    roomPatchCapacity,
    roomFeatureGetAll,
    roomFeatureGetById,
    roomFeaturePostCreate,
    roomFeatureDeleteById,
    roomFeaturePatchName,
    roomFeaturePatchDescription,
    roomGetLinkRoomfeature,
    roomPostLinkRoomfeature,
    roomDeleteLinkRoomfeature,
} from "@/services/room.service";

@Route("room")
@Tags("Room")
export class RoomController extends Controller {
    /**
     * @summary Get all rooms
     */
    @Get("all")
    public async controllerRoomGetAll(): Promise<Room[]> {
        const response = await roomGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get room by ID
     */
    @Get("id/{room_id}")
    public async controllerRoomGetById(
        @Path() room_id: number,
    ): Promise<Room> {
        const response = await roomGetById(room_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Create a new room
     */
    @Post("create")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomPostCreate(
        @Body() body: { building_id: number; name: string; description: string; capacity: number },
    ): Promise<Room> {
        const response = await roomPostCreate(body.building_id, body.name, body.description, body.capacity);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Delete room by ID
     */
    @Delete("delete/{room_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomDeleteById(
        @Path() room_id: number,
    ): Promise<void> {
        const response = await roomDeleteById(room_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change room's building ID
     */
    @Patch("building_id")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomPatchParentId(
        @Body() body: { room_id: number; new_building_id: number },
    ): Promise<void> {
        const response = await roomPatchBuildingId(body.room_id, body.new_building_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change room's name
     */
    @Patch("name")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomPatchName(
        @Body() body: { room_id: number; new_name: string },
    ): Promise<void> {
        const response = await roomPatchName(body.room_id, body.new_name);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change room's description
     */
    @Patch("description")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomPatchDescription(
        @Body() body: { room_id: number; new_description: string },
    ): Promise<void> {
        const response = await roomPatchDescription(body.room_id, body.new_description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change room's capacity
     */
    @Patch("capacity")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomPatchCapacity(
        @Body() body: { room_id: number; new_capacity: number },
    ): Promise<void> {
        const response = await roomPatchCapacity(body.room_id, body.new_capacity);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get room features linked to a room
     */
    @Get("link/{room_id}/feature")
    public async controllerRoomGetLinkRoomFeature(
        @Path() room_id: number,
    ): Promise<{ features: number[] }> {
        const response = await roomGetLinkRoomfeature(room_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Link a room feature to a room
     */
    @Post("link/{room_id}/feature/{room_feature_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomPostLinkRoomFeature(
        @Path() room_id: number,
        @Path() room_feature_id: number,
    ): Promise<void> {
        const response = await roomPostLinkRoomfeature(room_id, room_feature_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Unlink a room feature from a room
     */
    @Delete("link/{room_id}/feature/{room_feature_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomDeleteLinkRoomFeature(
        @Path() room_id: number,
        @Path() room_feature_id: number,
    ): Promise<void> {
        const response = await roomDeleteLinkRoomfeature(room_id, room_feature_id);
        this.setStatus(response.code);

        return response.body;
    }
}

@Route("room_feature")
@Tags("Room Feature")
export class RoomFeatureController extends Controller {
    /**
     * @summary Get all room features
     */
    @Get("all")
    public async controllerRoomFeatureGetAll(): Promise<RoomFeature[]> {
        const response = await roomFeatureGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get room feature by ID
     */
    @Get("id/{room_feature_id}")
    public async controllerRoomFeatureGetById(
        @Path() room_feature_id: number,
    ): Promise<RoomFeature> {
        const response = await roomFeatureGetById(room_feature_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Create a new room feature
     */
    @Post("create")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomFeaturePostCreate(
        @Body() body: { name: string; description: string },
    ): Promise<RoomFeature> {
        const response = await roomFeaturePostCreate(body.name, body.description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Delete room feature by ID
     */
    @Delete("delete/{room_feature_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomFeatureDeleteById(
        @Path() room_feature_id: number,
    ): Promise<void> {
        const response = await roomFeatureDeleteById(room_feature_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change room feature's name
     */
    @Patch("name")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomFeaturePatchName(
        @Body() body: { room_feature_id: number; new_name: string },
    ): Promise<void> {
        const response = await roomFeaturePatchName(body.room_feature_id, body.new_name);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change room feature's description
     */
    @Patch("description")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoomFeaturePatchDescription(
        @Body() body: { room_feature_id: number; new_description: string },
    ): Promise<void> {
        const response = await roomFeaturePatchDescription(body.room_feature_id, body.new_description);
        this.setStatus(response.code);

        return response.body;
    }
}
