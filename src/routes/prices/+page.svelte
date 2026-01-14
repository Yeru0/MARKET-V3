<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { invalid } from "$lib/client/invalidate.svelte.js";
	import { type ProductC } from "$lib/client/objects.svelte.js";
	import { priceList } from "$lib/client/priceList.svelte.js";
	import { onDestroy, onMount } from "svelte";

	let { data } = $props();

	let Categories = $state(JSON.parse(data.products));

	let getData = () => {
		console.log("invalidating");
		clearTimeout(stateTimeout);

		invalidateAll().then(() => {
			Categories = JSON.parse(data.products);

			// Removes the empty categories
			for (let cat of Categories) {
				if (!cat.Products) continue;
				let isActiveReduced = cat.Products.map((item: ProductC) => item.isActive);
				if (!isActiveReduced.includes(true)) Categories.splice(Categories.indexOf(cat), 1);
			}
		});
	};

	let stateTimeout: NodeJS.Timeout;

	// I'm not trusting that the invalidation works 100% of the time
	// This is the backup function
	let fallbackStateUpdate = () => {
		// 300000 ms is 5 mins
		stateTimeout = setTimeout(async () => {
			await getData();
			fallbackStateUpdate();
		}, 300000);
	};

	onMount(async () => {
		fallbackStateUpdate();
		await getData();

		invalid.add(getData);
	});

	onDestroy(() => {
		clearTimeout(stateTimeout);
	});
</script>

<svelte:head>
	<title>Market | Termékek</title>
</svelte:head>

<h1>Termékek</h1>

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

<style>
	h2 {
		color: var(--broken-white);
		font-size: 24px;
	}
</style>
