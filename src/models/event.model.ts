import { unknownToDate, unknownToNumber } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface Event {
    id            : number;
    start         : Date;
    end           : Date;
    lesson_id     : number;
    lesson_type_id: number;
    lesson_arg    : number;
}

export const mapEvent = createMapper<Event>({
    id            : createConverter(unknownToNumber, -1),
    start         : createConverter(unknownToDate, new Date()),
    end           : createConverter(unknownToDate, new Date()),
    lesson_id     : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    lesson_type_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    lesson_arg    : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
});

export interface LinkEventUser {
    user_id : number;
    event_id: number;
}

export const mapLinkEventUser = createMapper<LinkEventUser>({
    user_id : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    event_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
});

export interface LinkEventRoom {
    room_id : number;
    event_id: number;
}

export const mapLinkEventRoom = createMapper<LinkEventRoom>({
    room_id : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    event_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
});
