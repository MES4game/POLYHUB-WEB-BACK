import { Controller, Route, Tags, Get, Post, Delete, Patch, Security, Path, Body } from "tsoa";
import { Group } from "../models/group.model";
import {
    groupGetAll,
    groupGetById,
    groupPostCreate,
    groupDeleteById,
    groupPatchParentId,
    groupPatchName,
    groupPatchDescription,
    groupGetLinkUser,
    groupPostLinkUser,
    groupDeleteLinkUser,
    groupGetLinkLesson,
    groupPostLinkLesson,
    groupDeleteLinkLesson,
    groupGetChildren,
} from "@/services/group.service";

@Route("group")
@Tags("Group")
export class GroupController extends Controller {
    /**
     * @summary Get all groups
     */
    @Get("all")
    public async controllerGroupGetAll(): Promise<Group[]> {
        const response = await groupGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get group by ID
     */
    @Get("id/{group_id}")
    public async controllerGroupGetById(
        @Path() group_id: number,
    ): Promise<Group> {
        const response = await groupGetById(group_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get children groups by parent ID
     */
    @Get("children/{parent_id}")
    public async controllerGroupGetChildren(
        @Path() parent_id: null | number,
    ): Promise<Group[]> {
        const response = await groupGetChildren(parent_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Create a new group
     */
    @Post("create")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupPostCreate(
        @Body() body: { parent_id: null | number; name: string; description: string },
    ): Promise<Group> {
        const response = await groupPostCreate(body.parent_id, body.name, body.description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Delete group by ID
     */
    @Delete("delete/{group_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupDeleteById(
        @Path() group_id: number,
    ): Promise<void> {
        const response = await groupDeleteById(group_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change group's parent ID
     */
    @Patch("parent_id")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupPatchParentId(
        @Body() body: { group_id: number; new_parent_id: null | number },
    ): Promise<void> {
        const response = await groupPatchParentId(body.group_id, body.new_parent_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change group name
     */
    @Patch("name")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupPatchName(
        @Body() body: { group_id: number; new_name: string },
    ): Promise<void> {
        const response = await groupPatchName(body.group_id, body.new_name);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change group name
     */
    @Patch("description")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupPatchDescription(
        @Body() body: { group_id: number; new_description: string },
    ): Promise<void> {
        const response = await groupPatchDescription(body.group_id, body.new_description);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get users linked to group
     */
    @Get("link/{group_id}/user")
    public async controllerGroupGetLinkUser(
        @Path() group_id: number,
    ): Promise<{ users: number[] }> {
        const response = await groupGetLinkUser(group_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Link user to group
     */
    @Post("link/{group_id}/user/{user_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupPostLinkUser(
        @Path() group_id: number,
        @Path() user_id: number,
    ): Promise<void> {
        const response = await groupPostLinkUser(group_id, user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Unlink user from group
     */
    @Delete("link/{group_id}/user/{user_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupDeleteLinkUser(
        @Path() group_id: number,
        @Path() user_id: number,
    ): Promise<void> {
        const response = await groupDeleteLinkUser(group_id, user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get lessons linked to group
     */
    @Get("link/{group_id}/lesson")
    public async controllerGroupGetLinkLesson(
        @Path() group_id: number,
    ): Promise<{ lessons: { lesson: number; lesson_type: number; lesson_arg: number }[] }> {
        const response = await groupGetLinkLesson(group_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Link lesson to group
     */
    @Post("link/{group_id}/lesson/{lesson_id}/{lesson_type_id}/{lesson_arg}")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupPostLinkLesson(
        @Path() group_id: number,
        @Path() lesson_id: number,
        @Path() lesson_type_id: number,
        @Path() lesson_arg: number,
    ): Promise<void> {
        const response = await groupPostLinkLesson(group_id, lesson_id, lesson_type_id, lesson_arg);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Unlink lesson to group
     */
    @Delete("link/{group_id}/lesson/{lesson_id}/{lesson_type_id}/{lesson_arg}")
    @Security("auth", ["admin", "moderator"])
    public async controllerGroupDeleteLinkLesson(
        @Path() group_id: number,
        @Path() lesson_id: number,
        @Path() lesson_type_id: number,
        @Path() lesson_arg: number,
    ): Promise<void> {
        const response = await groupDeleteLinkLesson(group_id, lesson_id, lesson_type_id, lesson_arg);
        this.setStatus(response.code);

        return response.body;
    }
}
