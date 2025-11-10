export const CONTENT_CODES = [200, 201, 206] as const;
export const NO_CONTENT_CODES = [204, 205] as const;
export type TContentCode = typeof CONTENT_CODES[number];
export type TNoContentCode = typeof NO_CONTENT_CODES[number];

export class RequestSuccess<T extends object | undefined = undefined> {
    public code: TContentCode | TNoContentCode;
    public body: T;

    constructor(code: TContentCode, body: T);
    constructor(code: TNoContentCode);
    constructor(code: TContentCode | TNoContentCode, body?: T) {
        if (code in CONTENT_CODES) {
            if (body === undefined) throw new RequestError(500, `Success result body must defined for code ${code.toString()}`);

            this.code = code;
            this.body = body;
        }

        if (code in NO_CONTENT_CODES) {
            this.code = code;
            this.body = undefined as T;
        }

        throw new RequestError(500, `Result code ${code.toString()} is not supported`);
    }
}

export const ERROR_CODES = [400, 401, 403, 404, 405, 409, 500] as const;
export type TErrorCode = typeof ERROR_CODES[number];

export class RequestError extends Error {
    public code: TErrorCode;

    constructor(code: TErrorCode, message: string) {
        super(message);
        this.name = "RequestError";
        this.code = code;
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}
