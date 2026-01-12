<script lang="ts">
	import { invalid } from "$lib/client/invalidate.svelte";
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

	// This is needed, so that I can bind an input to the "tip" value
	// It's a kind of user input validation
	$effect(() => {
		if (tip > payed - basket.paySum && payed > basket.paySum) {
			tip = payed - basket.paySum;
		}
	});
</script>

<form
	onsubmit={async () => {
		await Products.sell(basket.content, priceList.state === "par" ? "n" : "s", tip);
		invalid.set();
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
							onkeyup={() => {
								basket.validateAmount();
							}}
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
				<td colspan="4"><strong>Összesítés</strong></td>
				<td>=</td>
				<td>{basket.paySum}</td>
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
				<td>{basket.paySum}</td>
				<td>
					<input type="number" name="payed" id="payed" bind:value={payed} max="100000000" min="1" required />
				</td>
				<td>
					<input type="number" name="tip" id="tip" bind:value={tip} max={payed - basket.paySum} min="0" />
				</td>
				<td>{payed - basket.paySum - tip}</td>
			</tr>
		</tbody>
	</table>

	<button disabled={payed - basket.paySum - tip < 0} type="submit">Eladás</button>
</form>
