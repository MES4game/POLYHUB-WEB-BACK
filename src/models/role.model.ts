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
