import { Controller, Route, Tags, Get, Post, Delete, Patch, Security, Path, Body } from "tsoa";
import { Building } from "../models/building.model";
import {
    buildingGetAll,
    buildingGetById,
    buildingPostCreate,
    buildingDeleteById,
    buildingPatchName,
    buildingPatchDescription,
    buildingGetLinkRoom,
} from "@/services/building.service";

@Route("building")
@Tags("Building")
export class BuildingController extends Controller {
    /**
     * @summary Get all buildings
     */
    @Get("all")
    public async controllerBuildingGetAll(): Promise<Building[]> {
        const response = await buildingGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get building by ID
     */
    @Get("id/{building_id}")
    public async controllerBuildingGetById(
        @Path() building_id: number,
    ): Promise<Building> {
        const response = await buildingGetById(building_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Create a new building
     */
    @Post("create")
    @Security("auth", ["admin", "moderator"])
    public async controllerBuildingPostCreate(
        @Body() body: { name: string; description: string },
    ): Promise<Building> {
        const response = await buildingPostCreate(body.name, body.description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Delete building by ID
     */
    @Delete("delete/{building_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerBuildingDeleteById(
        @Path() building_id: number,
    ): Promise<void> {
        const response = await buildingDeleteById(building_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change building name
     */
    @Patch("name")
    @Security("auth", ["admin", "moderator"])
    public async controllerBuildingPatchName(
        @Body() body: { building_id: number; new_name: string },
    ): Promise<void> {
        const response = await buildingPatchName(body.building_id, body.new_name);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change building description
     */
    @Patch("description")
    @Security("auth", ["admin", "moderator"])
    public async controllerBuildingPatchDescription(
        @Body() body: { building_id: number; new_description: string },
    ): Promise<void> {
        const response = await buildingPatchDescription(body.building_id, body.new_description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get rooms linked to a building
     */
    @Get("link/{building_id}/room")
    public async controllerUserGetLinkEvent(
        @Path() building_id: number,
    ): Promise<{ rooms: number[] }> {
        const response = await buildingGetLinkRoom(building_id);
        this.setStatus(response.code);

        return response.body;
    }
}
