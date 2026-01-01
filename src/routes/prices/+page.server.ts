import { ProductsC } from "$lib/client/objects.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let Products = new ProductsC();

	// ==== Sorting the categories ====
	// Asc by category name
	// Asc by product name inside category
	let cats = await Products.getCategories();
	cats.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});

	for (let cat of cats) {
		cat.Products.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	}

	return { products: JSON.stringify(cats) }; // It needs to be stringified because this function only returns POJOs
};
