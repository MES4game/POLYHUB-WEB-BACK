import { unknownToNumber, unknownToString } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface Room {
    id         : number;
    building_id: number;
    name       : string;
    description: string;
    capacity   : number;
}

export const mapRoom = createMapper<Room>({
    id         : createConverter(unknownToNumber, -1),
    building_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
    capacity   : createConverter(unknownToNumber, 0),
});

export interface RoomFeature {
    id         : number;
    name       : string;
    description: string;
}

export const mapRoomFeature = createMapper<RoomFeature>({
    id         : createConverter(unknownToNumber, -1),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
