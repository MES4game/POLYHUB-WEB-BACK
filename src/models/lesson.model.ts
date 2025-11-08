import { unknownToNumber, unknownToString } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface Lesson {
    id         : number;
    name       : string;
    description: string;
}

export const mapLesson = createMapper<Lesson>({
    id         : createConverter(unknownToNumber, -1),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});

export interface LessonType {
    id         : number;
    name       : string;
    description: string;
}

export const mapLessonType = createMapper<LessonType>({
    id         : createConverter(unknownToNumber, -1),
    name       : createConverter(unknownToString, ""),
    description: createConverter(unknownToString, ""),
});
