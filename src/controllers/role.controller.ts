import { Controller, Route, Tags, Get, Post, Delete, Patch, Security, Path, Body } from "tsoa";
import { Role } from "../models/role.model";
import {
    roleGetAll,
    roleGetById,
    rolePatchDescription,
    roleGetLinkUser,
    rolePostLinkUser,
    roleDeleteLinkUser,
} from "@/services/role.service";

@Route("role")
@Tags("Role")
export class RoleController extends Controller {
    /**
     * @summary Get all roles
     */
    @Get("all")
    public async controllerRoleGetAll(): Promise<Role[]> {
        const response = await roleGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get role by ID
     */
    @Get("id/{role_id}")
    public async controllerRoleGetById(
        @Path() role_id: number,
    ): Promise<Role> {
        const response = await roleGetById(role_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change role description
     */
    @Patch("description")
    @Security("auth", ["admin", "moderator"])
    public async controllerRolePatchDescription(
        @Body() body: { role_id: number; new_description: string },
    ): Promise<void> {
        const response = await rolePatchDescription(body.role_id, body.new_description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get users linked to role
     */
    @Get("link/{role_id}/user")
    public async controllerRoleGetLinkUser(
        @Path() role_id: number,
    ): Promise<{ users: number[] }> {
        const response = await roleGetLinkUser(role_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Link moderator role to user
     */
    @Post("link/moderator/user/{user_id}")
    @Security("auth", ["admin"])
    public async controllerRolePostModeratorLinkUser(
        @Path() user_id: number,
    ): Promise<void> {
        const response = await rolePostLinkUser("moderator", user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Unlink moderator role to user
     */
    @Delete("link/moderator/user/{user_id}")
    @Security("auth", ["admin"])
    public async controllerRoleDeleteModeratorLinkUser(
        @Path() user_id: number,
    ): Promise<void> {
        const response = await roleDeleteLinkUser("moderator", user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Link teacher role to user
     */
    @Post("link/teacher/user/{user_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerRolePostTeacherLinkUser(
        @Path() user_id: number,
    ): Promise<void> {
        const response = await rolePostLinkUser("teacher", user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Unlink teacher role to user
     */
    @Delete("link/teacher/user/{user_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerRoleDeleteTeacherLinkUser(
        @Path() user_id: number,
    ): Promise<void> {
        const response = await roleDeleteLinkUser("teacher", user_id);
        this.setStatus(response.code);

        return response.body;
    }
}
