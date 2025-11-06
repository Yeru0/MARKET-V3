import type { Product } from "$lib/prisma/browser";

export interface RequestCreateJSONBody {
    products: Product[]
}