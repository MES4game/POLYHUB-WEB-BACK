import { unknownToNumber, unknownToString } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface Group {
    id         : number;
    parent_id  : number;
    name       : string;
    description: string;
}

export const mapGroup = createMapper<Group>({
    id         : createConverter(unknownToNumber, -1),
    parent_id  : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
