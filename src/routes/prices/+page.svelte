<script lang="ts">
	import { priceList } from "$lib/client/priceList.js";

	let { data } = $props();

	let Categories = JSON.parse(data.products);
</script>

<h1>Árlista</h1>

{#each Categories as cat}
	<h2>{cat.name}</h2>
	{#each cat.Products as prod}
		<div>
			<p>{prod.name}</p>
			<p>{priceList.state === "par" ? prod.markupPriceSingle : prod.staffMarkupPriceSingle}</p>
		</div>
	{/each}
{/each}
