<script lang="ts">
	import { ProductC, SaleC, type BasketC } from "$lib/client/objects.svelte";
	import { priceList } from "$lib/client/priceList.svelte";

	let { basket, sale }: { basket: BasketC; sale: SaleC } = $props();

	let handleAmtChange = (item: { amt: number; Product: ProductC }) => {
		if (item.amt === 0 || !item.amt) {
			basket.setAmt(item.Product, 1);
		} else {
			basket.setAmt(item.Product, item.amt);
		}
	};
</script>

<h2>Kosár</h2>
<table>
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
				<td>{item.Product.name}</td>
				<td>{item.amt}</td>
				<td>×</td>
				<td
					>{priceList.state === "par" ? item.Product.markupPriceSingle : item.Product.staffMarkupPriceSingle}
				</td>
				<td>=</td>
				<td
					>{priceList.state === "par"
						? item.Product.markupPriceSingle * item.amt
						: item.Product.staffMarkupPriceSingle * item.amt}
				</td>
			</tr>
		{/each}
		<tr>
			<td colspan="4"><strong>Összesítés</strong></td>
			<td>=</td>
			<td>{basket.paySum}</td>
		</tr>
	</tbody>
</table>

<table>
	<thead>
		<tr>
			<th>Fizetett</th>
			<th>Borravaló</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>{basket.paySum}</td>
			<td>
				{sale.tip}
			</td>
		</tr>
	</tbody>
</table>
