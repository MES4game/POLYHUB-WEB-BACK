import { unknownToNumber } from "@/utils/convert.util";
import { createConverter, createMapper } from "@/utils/mapper.util";

export interface AuthToken {
    id: number;
}

export const mapAuthToken = createMapper<AuthToken>({
    id: createConverter(unknownToNumber, -1),
});
