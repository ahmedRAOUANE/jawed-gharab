import { z } from "zod";

export function zodShapeToPrismaSelect<T extends z.ZodRawShape>(shape: T): Record<string, true> {
    return Object.fromEntries(
        Object.keys(shape).map((key) => [key, true])
    );
}