<script lang="ts">
	import { keyboardEvents } from "$lib/client/keyboardEvents";
	import { ProductC, type BasketC, type ProductsC } from "$lib/client/objects.svelte";
	import { priceList } from "$lib/client/priceList.svelte";

	let { basket, Products }: { basket: BasketC; Products: ProductsC } = $props();

	let handleAmtChange = (item: { amt: number; Product: ProductC }) => {
		if (item.amt === 0 || !item.amt) {
			basket.setAmt(item.Product, 1);
		} else {
			basket.setAmt(item.Product, item.amt);
		}
	};

	let payed: number = $state(0);
	let tip: number = $state(0);
</script>

<form
	onsubmit={() => {
		Products.sell(basket.content, priceList.state === "par" ? "n" : "s", tip);
	}}
>
	<h2>Kosár</h2>
	<table>
		<thead>
			<tr>
				<th>Terméknév</th>
				<th colspan="2">Mennyiség</th>
				<th colspan="2">Ár</th>
				<th>Részösszeg</th>
				<th>Művelet</th>
			</tr>
		</thead>
		<tbody>
			{#each basket.content as item}
				<tr>
					<td>{item.Product.name}</td>
					<td>
						<button
							type="button"
							onclick={() => {
								if (keyboardEvents.ctrl) {
									basket.setAmt(item.Product, 1);
									return;
								}

								basket.remove(item.Product);
							}}>-</button
						>
						<input
							type="number"
							name="staff-markup"
							id="staff-markup"
							bind:value={item.amt}
							onblur={() => {
								handleAmtChange(item);
							}}
							max={item.Product.inStorage}
							min="1"
							required
						/>
						<button
							type="button"
							onclick={() => {
								if (keyboardEvents.ctrl) {
									basket.setAmt(item.Product, item.Product.inStorage);

									return;
								}

								basket.add(item.Product);
							}}>+</button
						>
					</td>
					<td>*</td>
					<td
						>{priceList.state === "par"
							? item.Product.markupPriceSingle
							: item.Product.staffMarkupPriceSingle}
					</td>
					<td>=</td>
					<td
						>{priceList.state === "par"
							? item.Product.markupPriceSingle * item.amt
							: item.Product.staffMarkupPriceSingle * item.amt}
					</td>
					<td
						><button
							onclick={() => {
								basket.remove(item.Product, true);
							}}>Törlés</button
						></td
					>
				</tr>
			{/each}
			<tr>
				<td><strong>Összesítés</strong></td>
				<td>{basket.amtSum}</td>
				<td>*</td>
				<td>{basket.priceSum}</td>
				<td>=</td>
				<td>{basket.amtSum * basket.priceSum}</td>
				<td>
					<button
						onclick={() => {
							basket.clear();
						}}>Kosár ürítése</button
					>
				</td>
			</tr>
		</tbody>
	</table>

	<table>
		<thead>
			<tr>
				<th>Fizetendő</th>
				<th>Fizetett</th>
				<th>Borravaló</th>
				<th>Visszajáró</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{basket.amtSum * basket.priceSum}</td>
				<td>
					<input type="number" name="payed" id="payed" bind:value={payed} max="100000000" min="1" required />
				</td>
				<td>
					<input type="number" name="tip" id="tip" bind:value={tip} max="100000000" min="0" />
				</td>
				<td>{payed - basket.amtSum * basket.priceSum - tip}</td>
			</tr>
		</tbody>
	</table>

	<button disabled={payed - basket.amtSum * basket.priceSum < 0} type="submit">Eladás</button>
</form>
