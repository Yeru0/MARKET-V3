<script lang="ts">
	import { invalidate, invalidateAll } from "$app/navigation";
	import { ProductC, ProductsC, toProdC } from "$lib/client/objects.svelte";
	import ManagePopup from "./managePopup.svelte";
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
			name: "",
			markup: 0,
			staffMarkup: 0,
			allSupplies: 0,
			supplyPrice: 0
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

	// Setup for modify popup
	let modPopupProps: {
		modProduct: obj,
		modify: (id: string | null) => Promise<ProductC | undefined>
	} = $state({
		modProduct: {
			name: "",
			markup: 0,
			staffMarkup: 0,
			allSupplies: 0,
			supplyPrice: 0
		},
		modify: async (id: string | null) => {
			if (id === null) return
			let modifiedProduct = await Products.update(id, modPopupProps.modProduct)
			await getData()

			return modifiedProduct
		}
	})
</script>

<h1>Storage</h1>

<ManagePopup caller={addPopupProps.add} bind:product={addPopupProps.newProduct} type="new" id={null}></ManagePopup>

{#await toProdC(productsPOJO)}
<p>Termékek betöltése...</p>
{:then value: ProductC[]}
	{#each value as p}
		<RenderProduct product={p}></RenderProduct>
		<DeletePopup remove={deletePopupProps.remove} product={p}></DeletePopup>
		<ManagePopup caller={modPopupProps.modify} bind:product={modPopupProps.modProduct} type="mod" id={p.id}></ManagePopup>
	{/each}
{:catch error}
	<p>Hiba történt a termékek betöltése közben!</p>
{/await}