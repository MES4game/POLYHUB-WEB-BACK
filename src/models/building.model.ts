import { unknownToNumber, unknownToString } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface Building {
    id         : number;
    name       : string;
    description: string;
}

export const mapBuilding = createMapper<Building>({
    id         : createConverter(unknownToNumber, -1),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
