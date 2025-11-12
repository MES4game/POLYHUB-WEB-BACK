import { unknownToNumber, unknownToString } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface Group {
    id         : number;
    parent_id  : null | number;
    name       : string;
    description: string;
}

export const mapGroup = createMapper<Group>({
    id         : createConverter(unknownToNumber, -1),
    parent_id  : createConverter((obj: unknown) => { return obj !== null ? Number(obj) : null; }, null),  // eslint-disable-line @typescript-eslint/naming-convention
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});

export interface LinkUserGroup {
    user_id : number;
    group_id: number;
}

export const mapLinkUserGroup = createMapper<LinkUserGroup>({
    user_id : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    group_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
});

export interface LinkLessonGroup {
    lesson_id     : number;
    lesson_type_id: number;
    lesson_arg    : number;
    group_id      : number;
}

export const mapLinkLessonGroup = createMapper<LinkLessonGroup>({
    lesson_id     : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    lesson_type_id: createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
    lesson_arg    : createConverter(unknownToNumber, 0),  // eslint-disable-line @typescript-eslint/naming-convention
    group_id      : createConverter(unknownToNumber, -1),  // eslint-disable-line @typescript-eslint/naming-convention
});
