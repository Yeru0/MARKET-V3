<script lang="ts">
	import { POJOToProdC, ProductC } from "$lib/client/objects.svelte";
	import { onMount } from "svelte";
	import RenderProds from "./RenderProds.svelte";

	let { data } = $props();

	let productsPOJO = JSON.parse(data.products);
	let products: ProductC[] = $state([]);

	onMount(() => {
		products = POJOToProdC(productsPOJO);
	});

	let basket: ProductC[] = $state([]);
</script>

<h1>Eladás</h1>

<RenderProds {products} {basket}></RenderProds>

{#each basket as item}
	<h2>{item.name}</h2>
{/each}
