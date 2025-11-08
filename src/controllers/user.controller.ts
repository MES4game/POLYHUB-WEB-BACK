import { type Request as ExpressRequest } from "express";
import { Controller, Route, Tags, Get, Security, Request } from "tsoa";
import { User } from "../models/user.model";
import { getSelf } from "@/services/user.service";

@Route("user")
@Tags("User")
export class UserController extends Controller {
    @Get("getSelf")
    @Security("auth")
    public async getSelf(
        @Request() req: ExpressRequest,
    ): Promise<User> {
        const response = await getSelf(req.user);
        this.setStatus(response.code);

        return response.body;
    }
}
