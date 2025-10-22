import { Request, Response, NextFunction } from "express";
import { unknowErrToString } from "@/utils/convert.util";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    console.error(err);
    res.status(500).json(unknowErrToString(err) || "Internal Server Error");
}
