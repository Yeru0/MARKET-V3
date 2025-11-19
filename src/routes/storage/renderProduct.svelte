<script lang="ts">
	import { ProductsC, ProductC } from "$lib/client/objects.svelte";

	const { products }: { products: ProductC[] } = $props();

	let Products = new ProductsC();

	// onMount(async () => {
	// 	await Products.new({
	// 		name: "test",
	// 		markup: 85,
	// 		staffMarkup: 25,
	// 		allSupplies: 24,
	// 		supplyPrice: 500
	// 	});
	// });
</script>

{#await products}
	<p>Termékek betöltése...</p>
{:then value: ProductC[]}
	{#each value as p}
		<h2>{p.name}</h2>
		<p>{p.allSupplies}</p>
	{/each}
{:catch error}
	<p>Hiba történt a termékek betöltése közben!</p>
{/await}
