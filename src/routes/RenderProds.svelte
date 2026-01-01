<script lang="ts">
	import { ProductC, ProductsC } from "$lib/client/objects.svelte";
	import { priceList } from "$lib/client/priceList";
	import { onMount } from "svelte";

	let { products, basket }: { products: ProductC[]; basket: ProductC[] } = $props();

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
			<tr>
				<td
					><button
						onclick={() => {
							basket.push(p);
						}}>{p.name}</button
					></td
				>
				<td>{priceList.state === "par" ? p.markupPriceSingle : p.staffMarkupPriceSingle} Ft</td>
				<td>{p.inStorage}/{p.allSupplies}</td>
				<td>{p.sold} db</td>
				<td>{p.takenOut} db</td>
				<td
					><button
						onclick={async () => {
							await Products.sell([p], "t");
						}}>Kivétel</button
					></td
				>
			</tr>
		{/each}
	</tbody>
</table>
