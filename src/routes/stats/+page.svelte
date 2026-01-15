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

<div class="body">
	<div class="head">
		<div class="header">
			<span class="material-symbols-outlined">
				leaderboard
			</span>
			<h1>Statisztika</h1>
		</div>
	
		<div>
			<div class="stat-container">
				<p class="name">Cél</p>
				<p class="stat">{Products.allIncome} Ft/{Products.suppliesPrice} Ft</p>
			</div>
		</div>
	</div>
	
	<div class="stats">
		<table class="money">
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
		
		<table class="storage">
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
	</div>
	
	<div class="sales">
		<div class="header">
			<span class="material-symbols-outlined">
				price_check
			</span>
			<h2>Korábbi eladások</h2>
		</div>
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
	</div>
	
</div>

<style>

	div.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		padding-bottom: 12px
	}

	.stats {
		display: flex;
		width: 100%;
		justify-content: space-evenly;
		padding: 24px 0;
		
		table {
			border-collapse: collapse;
			td, th {
				border: 1px solid var(--broken-white);
				padding: 6px;
				cursor: default;
				transition: all .1s ease-in-out;

				&:hover {
					color: #ffffffff;
				}
			}

			th {
				font-weight: bold;
				text-align: left;
				color: inherit;
			}
			td {
				text-align: right;
				color: #ffffffff;
			}
		}

	}


	div.stat-container {
		transition: all ease-in-out 0.2s;
		border: 1px dashed var(--broken-white);
		width: fit-content;
		border-radius: 12px;
		padding: 12px;
		min-width: fit-content;
		width: fit-content;
		display: flex;
		flex-direction: column;
		gap: 8px;
		cursor: default;

		.name {
			font-size: 24px;
			font-weight: bold;
			color: inherit;
		}

		.stat {
			color: #ffffffff;
			align-self: center;
			font-size: 20px;
		}

		&:hover {
			border-color: var(--accent);
			transform: scale(1.02);
			background-color: var(--transparent-white);
			color: #ffffffff;
		}

		&:active {
			transform: scale(1);
		}
	}

</style>