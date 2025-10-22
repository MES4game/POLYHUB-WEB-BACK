import { type Request as ExpressRequest } from "express";
import { Controller, Route, Tags, Get, Security, Request } from "tsoa";
import { mapUser, type User } from "../models/user.model";

@Route("user")
@Tags("User")
export class UserController extends Controller {
    @Get("getSelf")
    @Security("auth")
    public getUserSelf(
        @Request() req: ExpressRequest,
    ): User {
        this.setStatus(200);

        return req.user ?? mapUser({});
    }
}
