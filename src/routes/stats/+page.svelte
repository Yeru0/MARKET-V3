<script lang="ts">
	import { POJOToProdC, ProductC, ProductsC, SaleC } from "$lib/client/objects.svelte";
	import { onMount } from "svelte";
	import RenderSale from "./RenderSale.svelte";
	import { invalidateAll } from "$app/navigation";
	import { invalid } from "$lib/client/invalidate.svelte";

	let { data } = $props();

	let productsPOJO = JSON.parse(data.products);
	let products: ProductC[] = $state([]);
	let Products: ProductsC = $state(new ProductsC(false));

	let sales: SaleC[] = $state([]);
	let isLoading: boolean = $state(false);
	let didLoadAll: boolean = $state(false);

	const getData = async () => {
		invalidateAll().then(async () => {
			products = POJOToProdC(productsPOJO);
			Products.calculateDerivedProperties();
		});
		// TODO A jovoben ez is johetne a serverrol...
		Products.resetSkip();
		sales = await Products.getSales("next");
	};

	onMount(async () => {
		Products = new ProductsC(true);
		getData();
		invalid.add(getData);
	});

	const loadMore = (node: HTMLElement) => {
		const observer = new IntersectionObserver(
			async (entries) => {
				if (entries[0].isIntersecting) {
					isLoading = true;
					let newSales = await Products.getSales("next");
					if (newSales.length === 0) {
						didLoadAll = true;
						return;
					}
					for (let s of newSales) {
						const existingIDs = sales.map((item) => item.id);
						if (!existingIDs.includes(s.id)) sales.push(s);
					}

					isLoading = false;
				}
			},
			{
				threshold: 0.001,
				rootMargin: "100px"
			}
		);

		observer.observe(node);

		return {
			destroy() {
				observer.unobserve(node);
			}
		};
	};
</script>

<svelte:head>
	<title>Market | Statisztika</title>
</svelte:head>

<h1>Statisztika</h1>

<div>
	<h2>Cél:</h2>
	<p>{Products.allIncome} Ft/{Products.suppliesPrice} Ft</p>
</div>

<table>
	<tbody>
		<tr>
			<th>Profit</th>
			<td>{Products.profit} Ft</td>
		</tr>
		<tr>
			<th>Szervezői Profit</th>
			<td>{Products.staffProfit} Ft</td>
		</tr>
		<tr>
			<th>Összes Profit</th>
			<td>{Products.allProfit} Ft</td>
		</tr>
		<tr>
			<th>Bevétel</th>
			<td>{Products.income} Ft</td>
		</tr>
		<tr>
			<th>Szervezői bevétel</th>
			<td>{Products.staffIncome} Ft</td>
		</tr>
		<tr>
			<th>Összes bevétel</th>
			<td>{Products.allIncome} Ft</td>
		</tr>
		<tr>
			<th>Borravaló 😋</th>
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
			<td>{Products.inStorage}/{Products.allSupplies}</td>
		</tr>
		<tr>
			<th>Termékfajták</th>
			<td>{Products.inStorageTypes}/{Products.allSupplyTypes}</td>
		</tr>
		<tr>
			<th>Termékkategóriák</th>
			<td>{Products.inStorageCategories} db</td>
		</tr>
	</tbody>
</table>

{#each sales as s}
	<RenderSale sale={s}></RenderSale>
{/each}

{#if !didLoadAll}
	<div use:loadMore>
		{#if isLoading}
			<p>Eladások betöltése...</p>
		{/if}
	</div>
{/if}
