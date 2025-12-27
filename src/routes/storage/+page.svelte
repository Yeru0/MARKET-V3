<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { ProductC, ProductsC, toProdC } from "$lib/client/objects.svelte";
	import ManagePopup from "./managePopup.svelte";
	import DeletePopup from "./deletePopup.svelte";
	import RenderProduct from "./renderProduct.svelte";
	import { onMount } from "svelte";

	const { data } = $props();

	let productsPOJO = $state(JSON.parse(data.products)); //It is done like that, because a load function can only return POJOs

	let Products: ProductsC;

	let renderableProducts: ProductC[] = $state([]);

	onMount(async () => {
		Products = new ProductsC();
		renderableProducts = POJOToProdC(productsPOJO);
	});

	let POJOToProdC = (obj: any): ProductC[] => {
		let returnList: ProductC[] = [];
		for (let o of obj) {
			returnList.push(
				new ProductC({
					id: o.id,
					name: o.name,
					markup: o.markup,
					staffMarkup: o.staffMarkup,
					allSupplies: o.allSupplies,
					supplyPrice: o.supplyPrice,
					productCategory: o.category.name,
					productCategoryId: o.category.id,
					SaleEvents: o.sales
				})
			);
		}
		console.log(returnList);

		return returnList;
	};

	let getData = async () => {
		// Invalidate "data" and reassigns dependant variables
		await invalidate("/api/product/read/all");
		productsPOJO = JSON.parse(data.products);
		renderableProducts = toProdC(productsPOJO);
	};

	// Setup for the add popup
	interface obj {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
		category: string;
	}
	let addPopupProps: { add: () => Promise<ProductC>; newProduct: obj; show: boolean } = $state({
		show: false,
		newProduct: {
			name: "",
			markup: 0,
			staffMarkup: 0,
			allSupplies: 0,
			supplyPrice: 0,
			category: ""
		},
		add: async () => {
			let newProd = await Products.new(addPopupProps.newProduct);
			await getData();

			return newProd;
		}
	});

	// Setup for delete popup
	let deletePopupProps: {
		remove: (product: ProductC) => Promise<{ count: number }>;
	} = $state({
		remove: async (product: ProductC) => {
			let removedProduct = await Products.delete(product.id);
			await getData();

			product.deletePopup = false;

			return removedProduct;
		}
	});

	// Setup for modify popup
	let modPopupProps: {
		modify: (product: ProductC | obj) => Promise<ProductC | undefined>;
	} = $state({
		modify: async (product: ProductC | obj) => {
			if (product === null || !(product instanceof ProductC)) return;
			let modifiedProduct = await Products.update(product.id, {
				name: product.name,
				markup: product.markup,
				staffMarkup: product.staffMarkup,
				allSupplies: product.allSupplies,
				supplyPrice: product.supplyPrice,
				category: ""
			});
			await getData();

			product.updatePopup = false;

			return modifiedProduct;
		}
	});
</script>

<h1>Storage</h1>

{#if addPopupProps.show}
	<ManagePopup
		caller={addPopupProps.add}
		bind:product={addPopupProps.newProduct}
		type="new"
		bind:show={addPopupProps.show}
	></ManagePopup>
{:else}
	<button
		onclick={() => {
			addPopupProps.show = true;
		}}>Új termék</button
	>
{/if}

{#await renderableProducts}
	<p>Termékek betöltése...</p>
{:then value: ProductC[]}
	{#each value as p}
		<RenderProduct product={p}></RenderProduct>

		{#if p.deletePopup}
			<DeletePopup remove={deletePopupProps.remove} product={p} bind:show={p.deletePopup}></DeletePopup>
		{:else}
			<button
				onclick={() => {
					p.deletePopup = true;
				}}>Törlés</button
			>
		{/if}

		{#if p.updatePopup}
			<ManagePopup caller={modPopupProps.modify} product={p} type="mod" bind:show={p.updatePopup}></ManagePopup>
		{:else}
			<button
				onclick={() => {
					p.updatePopup = true;
				}}>Módosítás</button
			>
		{/if}
	{/each}
{:catch error}
	<p>Hiba történt a termékek betöltése közben!</p>
{/await}
