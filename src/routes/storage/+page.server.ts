import { ProductsC } from "$lib/client/objects.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let Products = new ProductsC();

	return { products: JSON.stringify(await Products.get()) }; // It needs to be stringified because this function only returns POJOs
};
