import { Request, Response } from 'express';

export function getHealth(_: Request, res: Response) {
    res.status(200).send("OK");
}
