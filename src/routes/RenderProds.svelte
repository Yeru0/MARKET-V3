<script lang="ts">
	import { keyboardEvents } from "$lib/client/keyboardEvents";
	import { BasketC, ProductC, ProductsC } from "$lib/client/objects.svelte";
	import { priceList } from "$lib/client/priceList.svelte";
	import { onMount } from "svelte";

	let { products, basket }: { products: ProductC[]; basket: BasketC } = $props();

	let Products: ProductsC;
	onMount(() => {
		Products = new ProductsC();
	});
</script>

<table>
	<thead>
		<tr>
			<th>Terméknév</th>
			<th>Ár</th>
			<th>Raktár</th>
			<th>Eladott</th>
			<th>Kivett</th>
			<th>Művelet</th>
		</tr>
	</thead>

	<tbody>
		{#each products as p}
			{#if p.isActive}
				<tr>
					<td
						><button
							onclick={() => {
								if (keyboardEvents.ctrl && keyboardEvents.shift && keyboardEvents.alt) {
									basket.remove(p, true);
									return;
								}
								if (keyboardEvents.ctrl && keyboardEvents.shift) {
									basket.setAmt(p, 1);
									return;
								}
								if (keyboardEvents.ctrl) {
									basket.setAmt(p, p.inStorage);
									return;
								}
								if (keyboardEvents.shift) {
									basket.remove(p);
									return;
								}

								basket.add(p);
							}}>{p.name}</button
						></td
					>
					<td>{priceList.state === "par" ? p.markupPriceSingle : p.staffMarkupPriceSingle} Ft</td>
					<td>{p.inStorage}/{p.allSupplies}</td>
					<td>{p.soldAll} db</td>
					<td>{p.takenOut} db</td>
					<td
						><button
							onclick={async () => {
								await Products.sell([{ Product: p, amt: 1 }], "t", 0);
							}}>Kivétel</button
						></td
					>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
