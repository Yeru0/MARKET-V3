<script lang="ts">
	import { ProductC, SaleC, type BasketC } from "$lib/client/objects.svelte";
	import { priceList } from "$lib/client/priceList.svelte";

	let { basket, sale, showPopup = $bindable() }: { basket: BasketC; sale: SaleC, showPopup: boolean } = $props();

</script>

<div class="body">
	<div class="head">
		<div class="header">
			<span class="material-symbols-outlined accent"> shopping_basket </span>
			<h2>Kosár</h2>
		</div>

		<button onclick={() => {showPopup = false}}>
			<span class="material-symbols-outlined">
				close
			</span>
		</button>
	</div>

	<table class="products">
		<thead>
			<tr>
				<th>Terméknév</th>
				<th>Mennyiség</th>
				<th colspan="2">Ár</th>
				<th colspan="2">Részösszeg</th>
			</tr>
		</thead>
		<tbody>
			{#each basket.content as item}
				<tr>
					<td class="name">{item.Product.name}</td>
					<td class="amt">{item.amt}</td>
					<td>×</td>
					<td
						>{priceList.state === "par" ? item.Product.markupPriceSingle : item.Product.staffMarkupPriceSingle} Ft
					</td>
					<td>=</td>
					<td
						>{priceList.state === "par"
							? item.Product.markupPriceSingle * item.amt
							: item.Product.staffMarkupPriceSingle * item.amt} Ft
					</td>
				</tr>
			{/each}
			<tr>
				<th colspan="4" class="summary">Összesítés</th>
				<td>=</td>
				<td>{basket.paySum} Ft</td>
			</tr>
		</tbody>
	</table>
	
	<table class="money">
		<thead>
			<tr>
				<th>Fizetett</th>
				<th>Borravaló</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="amt">{basket.paySum} Ft</td>
				<td class="amt">
					{sale.tip} Ft
				</td>
			</tr>
		</tbody>
	</table>
</div>

<style>

	.head {
		display: flex;
		justify-content: space-between;
		align-items: first baseline;

		button {
			background-color: transparent;
			color: var(--broken-white);
			transition: all ease-in-out .2s;

			&:hover {
				color: #fff;
			}
		}

		span {
			font-size: 24px;
			color: inherit;
		}
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 24px
	}

	table {
		width: 100%;
		max-width: 700px;
		margin: auto;
		height: fit-content;

		& th {
			font-weight: bold;
		}
		.amt {
			text-align: center;
		}
	}

	.products {

		.name {
			color: #fff;
			font-weight: bold
		}


		tr {
			transition: all ease-in-out .1s;
			cursor: default;
		}
		tr:hover {
			color: #fff;
		}

		td {
			padding: 3px 0;
			color: inherit;
		}

		th.summary {
			color: inherit;
			padding-top: 12px;
			text-align: left;
		}

	}

	.money {
		.amt {
			color: #fff;
		}
	}



</style>

