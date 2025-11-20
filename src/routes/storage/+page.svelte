<script lang="ts">
	import { invalidate, invalidateAll } from "$app/navigation";
	import { ProductC, ProductsC, toProdC } from "$lib/client/objects.svelte";
	import AddPopup from "./addPopup.svelte";
	import DeletePopup from "./deletePopup.svelte";
	import RenderProduct from "./renderProduct.svelte";

	const { data } = $props();

	let productsPOJO = $state(JSON.parse(data.products)); //It is done like that, because a load function can only return POJOs

	let Products = new ProductsC();

	let getData = async () => { // Invalidate "data" and reassings dependant variables
		await invalidate("/api/product/read/all");
		productsPOJO = JSON.parse(data.products);		
	}

	// Setup for the add popup
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
			await getData()

			return newProd;
		}
	});

	// Setup for delete popup
	let deletePopupProps: {
		remove: (id: string) => Promise<{count: number}>
	} = {
		remove: async (id: string) => {
			let removedProduct = await Products.delete(id)
			await getData()

			return removedProduct
		}
	}
</script>

<h1>Storage</h1>

<AddPopup add={addPopupProps.add} bind:newProduct={addPopupProps.newProduct}></AddPopup>

{#await toProdC(productsPOJO)}
<p>Termékek betöltése...</p>
{:then value: ProductC[]}
	{#each value as p}
		<RenderProduct product={p}></RenderProduct>
		<DeletePopup remove={deletePopupProps.remove} product={p}></DeletePopup>
	{/each}
{:catch error}
	<p>Hiba történt a termékek betöltése közben!</p>
{/await}