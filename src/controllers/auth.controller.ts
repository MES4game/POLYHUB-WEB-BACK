import { Controller, Route, Tags, Post, Path, Body, Get, SuccessResponse, Response } from "tsoa";
import { authPostLogin, authPostRegister, authGetVerifyEmail } from "@/services/auth.service";
import { ErrorResponse } from "../models/common.model";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
    /**
     * @summary Register a new user
     * @param {object} body - The registration information
     */
    @Post("register")
    @SuccessResponse(204, "Created")
    @Response<ErrorResponse>(400, "Bad Request", { message: "No email given or bad format" })
    @Response<ErrorResponse>(400, "Bad Request", { message: "No pseudo given or bad format (4-64 characters and /^[\\w!#$%&'*+/=?^_`{|}~-]+$/)" })
    @Response<ErrorResponse>(400, "Bad Request", { message: "No password given or bad format (12-64 characters and /^[\\w!#%*+/_~-]{12,64}$/)" })
    @Response<ErrorResponse>(400, "Bad Request", { message: "No firstname given or bad format (1-64 characters)" })
    @Response<ErrorResponse>(400, "Bad Request", { message: "No lastname given or bad format (1-64 characters)" })
    @Response<ErrorResponse>(409, "Conflict", { message: "Email already used by another user" })
    @Response<ErrorResponse>(409, "Conflict", { message: "Pseudo already used by another user" })
    @Response<ErrorResponse>(500, "Internal Server Error", { message: "Error while registering user: ..." })
    @Response<ErrorResponse>(500, "Internal Server Error", { message: "string" })
    public async controllerAuthPostRegister(
        @Body() body: { email: string; pseudo: string; firstname: string; lastname: string; password: string },
    ): Promise<void> {
        const response = await authPostRegister(
            body.email,
            body.pseudo,
            body.firstname,
            body.lastname,
            body.password,
        );
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Verify user's email
     * @param {string} token - The email verification token (from email link)
     */
    @Get("verifyEmail/{token}")
    @SuccessResponse(204, "Created")
    @Response<ErrorResponse>(400, "Bad Request", { message: "No token found" })
    @Response<ErrorResponse>(401, "Bad Request", { message: "Invalid token" })
    @Response<ErrorResponse>(500, "Internal Server Error", { message: "string" })
    public async controllerAuthPatchVerifyEmail(
        @Path() token: string,
    ): Promise<void> {
        const response = await authGetVerifyEmail(token);
        this.setStatus(response.code);

        return response.body;
    }

    /**
     * @summary Login with your credentials
     * @param {object} body - The login information (email/pseudo and password)
     */
    @Post("login")
    @SuccessResponse(200, "Logged In")
    @Response<ErrorResponse>(400, "Bad Request", { message: "No email/pseudo given or bad format" })
    @Response<ErrorResponse>(400, "Bad Request", { message: "No password given or bad format" })
    @Response<ErrorResponse>(401, "Bad Request", { message: "Invalid credentials" })
    @Response<ErrorResponse>(403, "Bad Request", { message: "Email not verified" })
    @Response<ErrorResponse>(500, "Internal Server Error", { message: "User hashed password not found" })
    @Response<ErrorResponse>(500, "Internal Server Error", { message: "string" })
    public async controllerAuthPostLogin(
        @Body() body: { user_login: string; password: string },
    ): Promise<{ token: string }> {
        const response = await authPostLogin(body.user_login, body.password);
        this.setStatus(response.code);

        return response.body;
    }
}
