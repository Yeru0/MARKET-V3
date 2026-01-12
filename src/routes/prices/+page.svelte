<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { invalid } from "$lib/client/invalidate.svelte.js";
	import { ProductCategoryC, toCatC, type ProductC } from "$lib/client/objects.svelte.js";
	import { priceList } from "$lib/client/priceList.svelte.js";
	import { onMount } from "svelte";

	let { data } = $props();

	let Categories = $state(JSON.parse(data.products));

	let getData = async () => {
		await invalidateAll();

		Categories = JSON.parse(data.products);

		// Removes the empty categories
		for (let cat of Categories) {
			let isActiveReduced = cat.Products.map((item: ProductC) => item.isActive);
			if (!isActiveReduced.includes(true)) Categories.splice(Categories.indexOf(cat), 1);
		}
	};

	onMount(() => {
		getData();

		invalid.add(getData);
	});
</script>

<h1>Árlista</h1>

{#each Categories as cat}
	<h2>{cat.name}</h2>
	{#each cat.Products as prod}
		{#if prod.isActive}
			<div>
				<p>{prod.name}</p>
				<p>{priceList.state === "par" ? prod.markupPriceSingle : prod.staffMarkupPriceSingle}</p>
			</div>
		{/if}
	{/each}
{/each}
