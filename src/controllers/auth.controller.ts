import { Controller, Route, Tags, Get, Post, Path, Body } from "tsoa";
import { type BodyLogin, type BodyRegister } from "../models/auth.model";
import { login, register, verify } from "@/services/auth.service";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
    @Post("register")
    public async register(
        @Body() body: BodyRegister,
    ): Promise<string> {
        const response = await register(body);
        this.setStatus(response.code);

        return response.body;
    }

    @Get("verify/{token}")
    public async verify(
        @Path() token: string,
    ): Promise<string> {
        const response = await verify(token);
        this.setStatus(response.code);

        return response.body;
    }

    @Post("login")
    public async login(
        @Body() body: BodyLogin,
    ): Promise<string> {
        const response = await login(body);
        this.setStatus(response.code);

        return response.body;
    }
}
