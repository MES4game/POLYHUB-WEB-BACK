import { type Request as ExpressRequest } from "express";
import { Controller, Route, Tags, Get, Post, Patch, Security, Request, Path, Body } from "tsoa";
import { User, BodyUserPatch } from "../models/user.model";
import {
    userGetSelf,
    userGetById,
    userGetAll,
    userPatchPseudo,
    userPatchFirstname,
    userPatchLastname,
    userPostResetPassword,
    userPatchPassword,
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

    @Patch("firstname/{new_firstname}")
    @Security("auth")
    public async controllerUserPatchFirstname(
        @Path() new_firstname: string,
        @Request() req: ExpressRequest,
    ): Promise<void> {
        const response = await userPatchFirstname(new_firstname, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    @Patch("lastname/{new_lastname}")
    @Security("auth")
    public async controllerUserPatchLastname(
        @Path() new_lastname: string,
        @Request() req: ExpressRequest,
    ): Promise<void> {
        const response = await userPatchLastname(new_lastname, req.user);
        this.setStatus(response.code);

        return response.body;
    }

    @Post("password/reset")
    @Security("auth")
    public async controllerUserGetResetPassword(
        @Request() req: ExpressRequest,
    ): Promise<void> {
        const response = await userPostResetPassword(req.user);
        this.setStatus(response.code);

        return response.body;
    }

    @Patch("password/reset/{token}/{new_password}")
    public async controllerUserPatchPassword(
        @Path() token: string,
        @Path() new_password: string,
    ): Promise<void> {
        const response = await userPatchPassword(token, new_password);
        this.setStatus(response.code);

        return response.body;
    }
}
