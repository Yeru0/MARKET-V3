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
	let addPopupProps: { add: () => Promise<ProductC>; newProduct: obj, show: boolean } = $state({
		show: false,
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
	} = $state({
		remove: async (id: string) => {
			let removedProduct = await Products.delete(id)
			await getData()

			return removedProduct
		}
	})

	// Setup for modify popup
	let modPopupProps: {
		show: boolean,
		modProduct: obj,
		modify: (id: string | null) => Promise<ProductC | undefined>
	} = $state({
		show: false,
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

			modPopupProps.show = false

			return modifiedProduct
		}
	})
</script>

<h1>Storage</h1>

{#if addPopupProps.show}
	<ManagePopup caller={addPopupProps.add} bind:product={addPopupProps.newProduct} type="new" id={null} bind:show={addPopupProps.show}></ManagePopup>
{:else}
	<button onclick={() => {addPopupProps.show = true}}>Új termék</button>
{/if}

{#await toProdC(productsPOJO)}
<p>Termékek betöltése...</p>
{:then value: ProductC[]}

	{#each value as p}

		<RenderProduct product={p}></RenderProduct>

		
		{#if p.deletePopup}
			<DeletePopup remove={deletePopupProps.remove} product={p} bind:show={p.deletePopup}></DeletePopup>
		{:else}
			<button onclick={() => {p.deletePopup = true}}>Törlés</button>
		{/if}

		{#if p.updatePopup}
			<ManagePopup caller={modPopupProps.modify} bind:product={modPopupProps.modProduct} type="mod" id={p.id} bind:show={p.updatePopup}></ManagePopup>
		{:else}
			<button onclick={() => {p.updatePopup = true}}>Módosítás</button>
		{/if}

	{/each}

{:catch error}
	<p>Hiba történt a termékek betöltése közben!</p>
{/await}