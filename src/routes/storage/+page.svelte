<script lang="ts">
	import { invalidate, invalidateAll } from "$app/navigation";
	import { ProductC, ProductsC, toProdC } from "$lib/client/objects.svelte";
	import AddPopup from "./addPopup.svelte";
	import RenderProduct from "./renderProduct.svelte";

	const { data } = $props();

	$inspect(data);

	let productsPOJO = $state(JSON.parse(data.products)); //It is done like that, because a load function can only return POJOs

	let Products = new ProductsC();

	// Set up for the add popup
	interface obj {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
	}
	let addPopupProps: { add: () => Promise<ProductC>; newProduct: obj } = $state({
		newProduct: {
			name: "test",
			markup: 85,
			staffMarkup: 25,
			allSupplies: 24,
			supplyPrice: 500
		},
		add: async () => {
			let newProd = await Products.new(addPopupProps.newProduct);
			await invalidate("/api/product/read/all");

			productsPOJO = JSON.parse(data.products);

			return newProd;
		}
	});
</script>

<h1>Storage</h1>

<AddPopup add={addPopupProps.add} bind:newProduct={addPopupProps.newProduct}></AddPopup>

<RenderProduct products={toProdC(productsPOJO)}></RenderProduct>
