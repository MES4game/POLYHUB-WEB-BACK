import { type Request as ExpressRequest } from "express";
import { Controller, Route, Tags, Get, Post, Patch, Security, Request, Path, Body } from "tsoa";
import { User } from "../models/user.model";
import {
    userGetAll,
    userGetById,
    userPatchPseudo,
    userPatchFirstname,
    userPatchLastname,
    userPostResetPassword,
    userPatchPassword,
    userGetIsRole,
    userGetLinkRole,
    userGetLinkGroup,
    userGetLinkEvent,
} from "@/services/user.service";

@Route("user")
@Tags("User")
export class UserController extends Controller {
    /**
     * @summary Get all users
     */
    @Get("all")
    @Security("auth", ["admin", "moderator"])
    public async controllerUserGetAll(): Promise<User[]> {
        const response = await userGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get self user
     */
    @Get("self")
    @Security("auth")
    public async controllerUserGetSelf(
        @Request() req: ExpressRequest,
    ): Promise<User> {
        const response = await userGetById(req.user?.id ?? -1);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get user by ID
     */
    @Get("id/{user_id}")
    public async controllerUserGetById(
        @Path() user_id: number,
    ): Promise<User> {
        const response = await userGetById(user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change self pseudo
     */
    @Patch("pseudo")
    @Security("auth")
    public async controllerUserPatchPseudo(
        @Request() req: ExpressRequest,
        @Body() body: { pseudo: string },
    ): Promise<void> {
        const response = await userPatchPseudo(body.pseudo, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change self firstname
     */
    @Patch("firstname")
    @Security("auth")
    public async controllerUserPatchFirstname(
        @Request() req: ExpressRequest,
        @Body() body: { firstname: string },
    ): Promise<void> {
        const response = await userPatchFirstname(body.firstname, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Change self lastname
     */
    @Patch("lastname")
    @Security("auth")
    public async controllerUserPatchLastname(
        @Request() req: ExpressRequest,
        @Body() body: { lastname: string },
    ): Promise<void> {
        const response = await userPatchLastname(body.lastname, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Initiate password reset
     */
    @Post("password/reset")
    public async controllerUserGetResetPassword(
        @Body() body: { email: string },
    ): Promise<void> {
        const response = await userPostResetPassword(body.email);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Reset password with token
     */
    @Patch("password")
    public async controllerUserPatchPassword(
        @Body() body: { token: string; new_password: string },
    ): Promise<void> {
        const response = await userPatchPassword(body.token, body.new_password);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Check if user is admin
     */
    @Get("admin/{id}")
    public async controllerUserGetIsAdmin(
        @Path() id: number,
    ): Promise<{ is_role: boolean }> {
        const response = await userGetIsRole("admin", id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Check if user is moderator
     */
    @Get("moderator/{id}")
    public async controllerUserGetIsModerator(
        @Path() id: number,
    ): Promise<{ is_role: boolean }> {
        const response = await userGetIsRole("moderator", id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Check if user is teacher
     */
    @Get("teacher/{id}")
    public async controllerUserGetIsTeacher(
        @Path() id: number,
    ): Promise<{ is_role: boolean }> {
        const response = await userGetIsRole("teacher", id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get roles linked to a user
     */
    @Get("link/{user_id}/role")
    public async controllerUserGetLinkRole(
        @Path() user_id: number,
    ): Promise<{ roles: number[] }> {
        const response = await userGetLinkRole(user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get groups linked to a user
     */
    @Get("link/{user_id}/group")
    public async controllerUserGetLinkGroup(
        @Path() user_id: number,
    ): Promise<{ groups: number[] }> {
        const response = await userGetLinkGroup(user_id);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Get events linked to a user
     */
    @Get("link/{user_id}/event")
    public async controllerUserGetLinkEvent(
        @Path() user_id: number,
    ): Promise<{ events: number[] }> {
        const response = await userGetLinkEvent(user_id);
        this.setStatus(response.code);

        return response.body;
    }
}
