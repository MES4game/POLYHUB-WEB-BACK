import jwt from "jsonwebtoken";
import crypto from "crypto";
import { StringValue } from "ms";
import { ENV } from "@/config/env.config";

const JWT_SECRET = crypto.randomBytes(128);

export function issueToken(payload: object, subject: string, expires_in: StringValue, single_use: boolean): string {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {
            algorithm: "HS512",
            expiresIn: expires_in,
            audience : ENV.host,
            issuer   : ENV.host,
            subject  : subject,
            ...single_use && { jwtid: crypto.randomUUID() },
        },
    );
}

export function verifyToken<T>(token: string, mapT: (obj: Record<string, unknown>) => T): T {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS512"],
            audience  : ENV.host,
            issuer    : ENV.host,
        });

        if (typeof decoded === "string") return { decoded } as T;

        return mapT(decoded);
    }
    catch {
        return mapT({});
    }
}
