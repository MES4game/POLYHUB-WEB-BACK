import { Controller, Route, Tags, Post, Path, Body, Get } from "tsoa";
import { BodyLogin, BodyRegister } from "../models/auth.model";
import { authPostLogin, authPostRegister, authGetVerifyEmail } from "@/services/auth.service";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
    @Post("register")
    public async controllerAuthPostRegister(
        @Body() body: BodyRegister,
    ): Promise<void> {
        const response = await authPostRegister(body);
        this.setStatus(response.code);

        return response.body;
    }

    @Get("verifyEmail/{token}")
    public async controllerAuthPatchVerifyEmail(
        @Path() token: string,
    ): Promise<void> {
        const response = await authGetVerifyEmail(token);
        this.setStatus(response.code);

        return response.body;
    }

    @Post("login")
    public async controllerAuthPostLogin(
        @Body() body: BodyLogin,
    ): Promise<{ token: string }> {
        const response = await authPostLogin(body);
        this.setStatus(response.code);

        return response.body;
    }
}
