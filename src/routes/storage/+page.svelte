<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { POJOToProdC, ProductC, ProductsC } from "$lib/client/objects.svelte";
	import ManagePopup from "./managePopup.svelte";
	import DeletePopup from "./deletePopup.svelte";
	import RenderProduct from "./renderProduct.svelte";
	import { onMount } from "svelte";
	import { invalid } from "$lib/client/invalidate.svelte";

	const { data } = $props();

	let productsPOJO = $state(JSON.parse(data.products)); //It is done like that, because a load function can only return POJOs

	let Products: ProductsC = new ProductsC(false);

	let renderableProducts: ProductC[] = $state([]);

	let getData = () => {
		// Invalidate "data" and reassigns dependant variables
		invalidateAll().then(() => {
			productsPOJO = JSON.parse(data.products);
			renderableProducts = POJOToProdC(productsPOJO);
		});
	};

	onMount(async () => {
		Products = new ProductsC(true);
		renderableProducts = POJOToProdC(productsPOJO);

		invalid.add(getData);
	});

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

			invalid.set();

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
			invalid.set();

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
				category: product.category
			});
			await getData();
			invalid.set();

			product.updatePopup = false;

			return modifiedProduct;
		}
	});
</script>

<svelte:head>
	<title>Market | Raktár</title>
</svelte:head>

<div class="body">
	<div class="head">
		<h1>Raktár</h1>

		{#if addPopupProps.show}
			<div class="overlay-bg">
				<button
					onclick={() => {
						addPopupProps.show = false;
					}}
					class="overlay-button"
					aria-label="close overlay"
				></button>
				<ManagePopup
					caller={addPopupProps.add}
					bind:product={addPopupProps.newProduct}
					type="new"
					bind:show={addPopupProps.show}
				></ManagePopup>
			</div>
		{:else}
			<button
				onclick={() => {
					addPopupProps.show = true;
				}}>Új termék</button
			>
		{/if}
	</div>

	{#await renderableProducts}
		<p>Termékek betöltése...</p>
	{:then value: ProductC[]}
		{#each value as p}
			<div class="product-body">
				<div class="product-head">
					<h2>{p.name}</h2>
					<div class="action-buttons">
						{#if p.deletePopup}
							<div class="overlay-bg">
								<button
									onclick={() => {
										p.deletePopup = false;
									}}
									class="overlay-button"
									aria-label="close overlay"
								></button>
								<DeletePopup remove={deletePopupProps.remove} product={p} bind:show={p.deletePopup}
								></DeletePopup>
							</div>
						{:else}
							<button
								onclick={() => {
									p.deletePopup = true;
								}}>Törlés</button
							>
						{/if}
						{#if p.updatePopup}
							<div class="overlay-bg">
								<button
									onclick={() => {
										p.updatePopup = false;
									}}
									class="overlay-button"
									aria-label="close overlay"
								></button>
								<ManagePopup
									caller={modPopupProps.modify}
									product={p}
									type="mod"
									bind:show={p.updatePopup}
								></ManagePopup>
							</div>
						{:else}
							<button
								onclick={() => {
									p.updatePopup = true;
								}}>Módosítás</button
							>
						{/if}
					</div>
				</div>
				<RenderProduct product={p}></RenderProduct>
			</div>
		{/each}
	{:catch error}
		<p>Hiba történt a termékek betöltése közben!</p>
	{/await}
</div>

<style>
	.body {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.head {
		display: grid;
		grid-template-columns: auto auto;

		button {
			place-self: end;
		}
	}

	.product-body {
		border: 4px dashed var(--broken-white);
		border-radius: 24px;
		padding: 24px;

		.product-head {
			display: flex;
			justify-content: space-between;
			margin: 12px;
		}
	}
</style>
