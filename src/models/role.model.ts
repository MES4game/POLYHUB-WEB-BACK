import { unknownToNumber, unknownToString } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface Role {
    id         : number;
    name       : string;
    description: string;
}

export const mapRole = createMapper<Role>({
    id         : createConverter(unknownToNumber, -1),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});

export interface LinkUserRole {
    user_id: number;
    role_id: number;
}

export const mapLinkUserRole = createMapper<LinkUserRole>({
    user_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    role_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
});
