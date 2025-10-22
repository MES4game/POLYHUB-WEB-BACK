import { ServiceResponse } from "@/models/common.model";

export function get(): ServiceResponse<string> {
    return { code: 200, body: "OK" };
}
