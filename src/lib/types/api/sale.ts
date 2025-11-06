import type { Product } from "$lib/prisma/browser";

export interface RequestCreateJSONBody {
    productIDs: string[]
}

export interface RequestReadJSONBody {
    id: string
}