import { ProductC, ProductsC } from "$lib/client/objects.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	let Products = new ProductsC();
	let prods = await Products.get();
	let noRemaining: ProductC[] = [];

	for (let p of prods) {
		if (p.isActive) continue;

		prods.splice(prods.indexOf(p), 1);
		noRemaining.push(p);
	}

	noRemaining.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
	prods = [...prods, ...noRemaining];
	return { products: JSON.stringify(prods) }; // It needs to be stringified because this function only returns POJOs
};
