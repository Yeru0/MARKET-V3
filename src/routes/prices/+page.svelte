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

<div class="body">
	<div class="header">
		<span class="material-symbols-outlined accent"> grocery </span>
		<h1 class="title">Termékek</h1>
	</div>
	
	<div class="content">
		{#each Categories as cat}
			<div class="cat">
				<h2>{cat.name}</h2>
				{#each cat.Products as prod}
					{#if prod.isActive}
						<div class="prod">
							<div class="content">
								<p>{prod.name}</p>
								<p>{priceList.state === "par" ? prod.markupPriceSingle : prod.staffMarkupPriceSingle} Ft</p>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	h2 {
		font-size: 24px;
	}

	.body {
		height: calc(100vh - (120px));
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;

		.cat {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			flex: 1;
			row-gap: 8px;
			column-gap: 18px;
			flex-wrap: wrap;
			.prod {
				display: flex;
				
				.content {
					display: flex;
					flex-direction: row;
					padding-bottom: 2px;
					justify-content: space-between;
					margin: auto;
					border-bottom: 1px solid var(--broken-white);
					width: 100%;
				}
			}
		}
	}

</style>
