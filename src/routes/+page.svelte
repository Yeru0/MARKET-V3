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

<h1>Eladás</h1>

<RenderProds {products} basket={Products.basket}></RenderProds>

{#if Products?.basket.content.length > 0}
	<RenderInteractiveBasket basket={Products.basket} {Products}></RenderInteractiveBasket>
{/if}
