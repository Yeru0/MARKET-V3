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
	<div class="header">
		<span class="material-symbols-outlined accent"> shopping_basket </span>
		<h2>Kosár</h2>
	</div>
	<table>
		<thead>
			<tr>
				<th>Terméknév</th>
				<th colspan="2">Mennyiség</th>
				<th colspan="2">{priceList.state === "par" ? "Résztvevői ár" : "Szervezői ár"}</th>
				<th>Részösszeg</th>
				<th>Művelet</th>
			</tr>
		</thead>
		<tbody>
			{#each basket.content as item}
				<tr>
					<td>{item.Product.name}</td>
					<td class="amt">
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
					<td>×</td>
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
							class="exec"
							onclick={() => {
								basket.remove(item.Product, true);
							}}>Törlés</button
						></td
					>
				</tr>
			{/each}
			<tr>
				<th colspan="4" style="text-align: left">Összesítés</th>
				<td>=</td>
				<td>{basket.paySum}</td>
				<td>
					<button
						class="exec"
						onclick={() => {
							basket.clear();
						}}>Kosár ürítése</button
					>
				</td>
			</tr>
		</tbody>
	</table>

	<table class="pay">
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
				<td class="text">{basket.paySum} Ft</td>
				<td>
					<div class="input-container">
						<input
							type="number"
							name="payed"
							id="payed"
							bind:value={payed}
							max="100000000"
							min="1"
							required
						/>
					</div>
				</td>
				<td>
					<div class="input-container">
						<input type="number" name="tip" id="tip" bind:value={tip} max={payed - basket.paySum} min="0" />
					</div>
				</td>
				<td class="text">{payed - basket.paySum - tip} Ft</td>
			</tr>
		</tbody>
	</table>

	<button class="sell-button" disabled={payed - basket.paySum - tip < 0} type="submit">Eladás</button>
</form>

<style>
	form {
		margin-bottom: 60px;

		.sell-button {
			width: 100%;
			background-color: var(--transparent-white);
		}
		.sell-button:hover {
			background-color: var(--accent);
			color: #000000ff;
		}
	}

	table {
		width: 100%;
		max-width: 700px;
		margin: auto;
		height: fit-content;

		& th {
			font-weight: bold;
		}
	}

	button.exec {
		width: 100%;
		text-align: left;
		text-align: center;
	}

	.amt {
		display: grid;
		grid-template-columns: repeat(3, auto);
		grid-template-rows: auto;
		gap: 4px;

		& button {
			max-width: 32px;
			aspect-ratio: 1/1;
			text-align: center;
			padding: 4px;
		}
	}

	.pay {
		margin: 32px auto;

		.input-container {
			display: grid;
			place-items: center;
			width: 100%;
		}

		input {
			width: 90%;
			margin: auto;
		}

		.text {
			text-align: center;
		}
	}

	/* Hide arrows from number input fields */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
