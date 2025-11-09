import { Request, Response, NextFunction } from "express";
import { unknowErrToString } from "@/utils/convert.util";
import { RequestError } from "@/models/common.model";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof RequestError) res.status(err.code).json(err.message);
    else                             res.status(500).json(unknowErrToString(err) || "Internal Server Error");
}
