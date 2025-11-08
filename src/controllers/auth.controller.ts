import { Controller, Route, Tags, Get, Post, Path, Body } from "tsoa";
import { BodyLogin, BodyRegister } from "../models/auth.model";
import { login, register, verifyEmail } from "@/services/auth.service";

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

    @Get("verifyEmail/{token}")
    public async verifyEmail(
        @Path() token: string,
    ): Promise<string> {
        const response = await verifyEmail(token);
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
