<script lang="ts">
	import { POJOToProdC, ProductC, ProductsC } from "$lib/client/objects.svelte";
	import { onMount } from "svelte";
	import RenderProds from "./RenderProds.svelte";
	import RenderInteractiveBasket from "./RenderInteractiveBasket.svelte";

	let { data } = $props();

	let productsPOJO = JSON.parse(data.products);
	let products: ProductC[] = $state([]);
	let Products: ProductsC = $state(new ProductsC(false));

	onMount(() => {
		Products = new ProductsC(true);
		products = POJOToProdC(productsPOJO);
	});
</script>

<h1>Eladás</h1>

<RenderProds {products} basket={Products.basket}></RenderProds>

{#if Products?.basket.content.length > 0}
	<RenderInteractiveBasket basket={Products.basket} {Products}></RenderInteractiveBasket>
{/if}
