import { RequestSuccess } from "@/models/common.model";

export function healthGet(): RequestSuccess {
    return new RequestSuccess(204);
}
