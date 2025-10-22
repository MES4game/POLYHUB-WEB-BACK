import { unknownToBoolean, unknownToDate, unknownToNumber, unknownToString } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface User {
    id             : number;
    email          : string;
    pseudo         : string;
    firstname      : string;
    lastname       : string;
    created_on     : Date;
    last_connection: Date;
    deleted_on     : Date;
    validated_email: boolean;
    verified       : boolean;
}

export const mapUser = createMapper<User>({
    /* eslint-disable @typescript-eslint/naming-convention */
    id             : createConverter(unknownToNumber, -1),
    email          : createConverter(unknownToString, ""),
    pseudo         : createConverter(unknownToString, ""),
    firstname      : createConverter(unknownToString, ""),
    lastname       : createConverter(unknownToString, ""),
    created_on     : createConverter(unknownToDate, new Date()),
    last_connection: createConverter(unknownToDate, new Date()),
    deleted_on     : createConverter(unknownToDate, new Date()),
    validated_email: createConverter(unknownToBoolean, false),
    verified       : createConverter(unknownToBoolean, false),

    /* eslint-enable @typescript-eslint/naming-convention */
});

export interface UserHashedPassword {
    user_id: number;
    value  : string;
}

export const mapUserHashedPassword = createMapper<UserHashedPassword>({
    /* eslint-disable @typescript-eslint/naming-convention */
    user_id: createConverter(unknownToNumber, -1),
    value  : createConverter(unknownToString, ""),

    /* eslint-enable @typescript-eslint/naming-convention */
});

export interface Role {
    id  : number;
    name: string;
}

export const mapRole = createMapper<Role>({
    id  : createConverter(unknownToNumber, -1),
    name: createConverter(unknownToString, ""),
});
