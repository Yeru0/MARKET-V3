<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

	const { product }: { product: ProductC } = $props();
</script>

{#snippet mainStat(name: string, stat: string | number)}
	<div class="stat-container">
		<p class="name">{name}</p>
		<p class="stat">{stat}</p>
	</div>
{/snippet}

<div class="body">
	<div class="main-stats">
		{@render mainStat("Cél", `${product.allIncome}/${product.suppliesPrice}`)}
		{@render mainStat("Raktár", `${product.inStorage}/${product.allSupplies}`)}
		{@render mainStat("Eladott", `${product.soldAll} db`)}
		{@render mainStat("Beszerzési ár (Ft/db)", `${product.supplyPrice} Ft`)}
		{@render mainStat("Résztvevői ár", `${product.markupPriceSingle} Ft`)}
		{@render mainStat("Szervezői ár", `${product.staffMarkupPriceSingle} Ft`)}
	</div>

	<div class="stats">
		<table>
			<tbody>
				<tr>
					<th>Profit</th>
					<td>{product.markup} % / {product.profitSingle} Ft</td>
				</tr>
				<tr>
					<th>Szervezői profit</th>
					<td>{product.staffMarkup} % / {product.staffProfitSingle} Ft</td>
				</tr>

				<tr>
					<th>Beszerzési ár (összes)</th>
					<td>{product.suppliesPrice} Ft</td>
				</tr>
			</tbody>
		</table>

		<span class="sep"></span>

		<table>
			<tbody>
				<tr>
					<th>Eladott (résztvevői):</th>
					<td>{product.staffMarkup} % / {product.staffProfitSingle} Ft</td>
				</tr>
				<tr>
					<th>Eladott (szervezői):</th>
					<td>{product.staffMarkup} % / {product.staffProfitSingle} Ft</td>
				</tr>
				<tr>
					<th>Eladott (kivett):</th>
					<td>{product.staffMarkup} % / {product.staffProfitSingle} Ft</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
	div.body {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: repeat(2, auto);
		gap: 24px;
	}

	.main-stats {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: stretch;
		margin: auto;

		div {
			flex: 1 0 25%;
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
	.stats {
		display: flex;
		gap: 24px;

		.sep {
			width: 0px;
			border: 1px solid var(--broken-white);
		}
	}

	table {
		border-collapse: collapse;
		width: 100%;

		tr {
			display: flex;
			justify-content: space-between;
		}
		tr {
			padding: 8px;
			transition: all ease-in-out 0.2s;
			border-bottom: 1px solid #ffffff00;
			cursor: default;

			&:hover {
				color: #ffffffff;
				border-bottom: 1px solid #ffffffff;

				td,
				th {
					color: inherit;
				}
			}
		}
	}
</style>
