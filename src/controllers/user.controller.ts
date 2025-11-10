import { type Request as ExpressRequest } from "express";
import { Controller, Route, Tags, Get, Post, Patch, Security, Request, Path, Body } from "tsoa";
import { User, BodyUserPatch, BodyUserPasswordPatch } from "../models/user.model";
import {
    userGetSelf,
    userGetById,
    userGetAll,
    userPatchPseudo,
    userPatchFirstname,
    userPatchLastname,
    userPostResetPassword,
    userPatchPassword,
    userGetIsAdmin,
    userGetIsModerator,
    userGetIsTeacher,
} from "@/services/user.service";

@Route("user")
@Tags("User")
export class UserController extends Controller {
    @Get("self")
    @Security("auth")
    public async controllerUserGetSelf(
        @Request() req: ExpressRequest,
    ): Promise<User> {
        const response = await userGetSelf(req.user);
        this.setStatus(response.code);

        return response.body;
    }

    @Get("{user_id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerUserGetById(
        @Path() user_id: number,
    ): Promise<User> {
        const response = await userGetById(user_id);
        this.setStatus(response.code);

        return response.body;
    }

    @Get("all")
    @Security("auth", ["admin", "moderator"])
    public async controllerUserGetAll(): Promise<User[]> {
        const response = await userGetAll();
        this.setStatus(response.code);

        return response.body;
    }

    @Patch("pseudo")
    @Security("auth")
    public async controllerUserPatchPseudo(
        @Request() req: ExpressRequest,
        @Body() body: BodyUserPatch,
    ): Promise<void> {
        const response = await userPatchPseudo(body.value, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    @Patch("firstname")
    @Security("auth")
    public async controllerUserPatchFirstname(
        @Request() req: ExpressRequest,
        @Body() body: BodyUserPatch,
    ): Promise<void> {
        const response = await userPatchFirstname(body.value, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    @Patch("lastname")
    @Security("auth")
    public async controllerUserPatchLastname(
        @Request() req: ExpressRequest,
        @Body() body: BodyUserPatch,
    ): Promise<void> {
        const response = await userPatchLastname(body.value, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    @Post("password/reset")
    public async controllerUserGetResetPassword(
        @Body() body: BodyUserPatch,
    ): Promise<void> {
        const response = await userPostResetPassword(body.value);
        this.setStatus(response.code);

        return response.body;
    }

    @Patch("password/reset")
    public async controllerUserPatchPassword(
        @Body() body: BodyUserPasswordPatch,
    ): Promise<void> {
        const response = await userPatchPassword(body.token, body.new_password);
        this.setStatus(response.code);

        return response.body;
    }

    @Get("isAdmin/{id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerUserGetIsAdmin(
        @Path() id: number,
    ): Promise<{ is_admin: boolean }> {
        const response = await userGetIsAdmin(id);
        this.setStatus(response.code);

        return response.body;
    }

    @Get("isModerator/{id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerUserGetIsModerator(
        @Path() id: number,
    ): Promise<{ is_moderator: boolean }> {
        const response = await userGetIsModerator(id);
        this.setStatus(response.code);

        return response.body;
    }

    @Get("isTeacher/{id}")
    @Security("auth", ["admin", "moderator"])
    public async controllerUserGetIsTeacher(
        @Path() id: number,
    ): Promise<{ is_teacher: boolean }> {
        const response = await userGetIsTeacher(id);
        this.setStatus(response.code);

        return response.body;
    }
}
