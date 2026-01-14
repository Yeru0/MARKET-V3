<script lang="ts">
	import { POJOToProdC, ProductC, ProductsC } from "$lib/client/objects.svelte";
	import { onMount } from "svelte";
	import RenderProds from "./RenderProds.svelte";
	import RenderInteractiveBasket from "./RenderInteractiveBasket.svelte";
	import { invalid } from "$lib/client/invalidate.svelte";
	import { invalidateAll } from "$app/navigation";

	let { data } = $props();

	let productsPOJO = $state(JSON.parse(data.products));
	let products: ProductC[] = $state([]);
	let Products: ProductsC = $state(new ProductsC(false));

	const getData = () => {
		invalidateAll().then(() => {
			productsPOJO = JSON.parse(data.products);
			products = POJOToProdC(productsPOJO);
		});
	};

	onMount(async () => {
		getData();
		Products = new ProductsC(true);
		invalid.add(getData);
	});
</script>

<svelte:head>
	<title>Market | Eladás</title>
</svelte:head>

<div class="body">
	<div class="header">
		<span class="material-symbols-outlined accent"> grocery </span>
		<h1 class="title">Termékek</h1>
	</div>

	<div class="prods">
		<RenderProds {products} basket={Products.basket}></RenderProds>
	</div>
	<div class="basket">
		{#if Products?.basket.content.length > 0}
			<RenderInteractiveBasket basket={Products.basket} {Products}></RenderInteractiveBasket>
		{/if}
	</div>
</div>

<style>
	.body {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: repeat(3, auto);
		gap: 24px;
	}
</style>
