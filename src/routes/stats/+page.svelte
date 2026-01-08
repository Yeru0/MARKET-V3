<script lang="ts">
	import { POJOToProdC, ProductC, ProductsC } from "$lib/client/objects.svelte";
	import { onMount } from "svelte";

	let { data } = $props();

	let productsPOJO = JSON.parse(data.products);
	let products: ProductC[] = $state([]);
	let Products: ProductsC = $state(new ProductsC(false));

	onMount(() => {
		Products = new ProductsC(true);
		products = POJOToProdC(productsPOJO);
	});
</script>

<h1>Statisztika</h1>

<div>
	<h2>Cél:</h2>
	<p>{Products.allIncome} Ft/{Products.suppliesPrice} Ft</p>
</div>

<table>
	<tbody>
		<tr>
			<th>Profit</th>
			<td>{Products.profit} Ft/{Products.profitPossible} Ft</td>
		</tr>
		<tr>
			<th>Szervezői Profit</th>
			<td>{Products.staffProfit} Ft/{Products.staffProfitPossible} Ft</td>
		</tr>
		<tr>
			<th>Összes Profit</th>
			<td>{Products.staffProfit} Ft/{Products.staffProfitPossible} Ft</td>
		</tr>
		<tr>
			<th>Bevétel</th>
			<td>{Products.income} Ft/{Products.incomePossible} Ft</td>
		</tr>
		<tr>
			<th>Szervezői bevétel</th>
			<td>{Products.staffIncome} Ft/{Products.staffIncomePossible} Ft</td>
		</tr>
		<tr>
			<th>Összes bevétel</th>
			<td>{Products.allIncome} Ft/{Products.allIncomePossible} Ft</td>
		</tr>
		<tr>
			<th>Borravaló ❤</th>
			<td>{Products.tips} Ft</td>
		</tr>
	</tbody>
</table>

<table>
	<tbody>
		<tr>
			<th>Eladott</th>
			<td>{Products.sold} db</td>
		</tr>
		<tr>
			<th>Szervezőnek eladott</th>
			<td>{Products.soldToStaff} db</td>
		</tr>
		<tr>
			<th>Összessen eladott</th>
			<td>{Products.soldAll} db</td>
		</tr>
		<tr>
			<th>Kivett</th>
			<td>{Products.takenOut} db</td>
		</tr>
		<tr>
			<th>Raktáron</th>
			<td>{Products.inStorage} db/{Products.allSupplies} db</td>
		</tr>
		<tr>
			<th>Termékfajták</th>
			<td>{Products.inStorageTypes} db</td>
		</tr>
		<tr>
			<th>Termékkategóriák</th>
			<td>{Products.inStorageCategories} db</td>
		</tr>
	</tbody>
</table>
