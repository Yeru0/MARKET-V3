<script lang="ts">
	import { keyboardEvents } from "$lib/client/keyboardEvents";
	import { ProductC, ProductsC } from "$lib/client/objects.svelte";
	import { onDestroy, onMount } from "svelte";

	interface obj {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
		category: string;
	}

	let {
		caller,
		invalidator,
		product = $bindable(),
		type,
		show = $bindable()
	}: {
		caller: (product: ProductC | obj) => Promise<ProductC | undefined>;
		invalidator: () => void;
		product: obj | ProductC;
		type: "new" | "mod";
		show: boolean;
	} = $props();

	let products: ProductsC = $state(new ProductsC(false));

	onMount(() => {
		products = new ProductsC(true);
		document.body.classList.add("noscroll");
	});
	onDestroy(() => {
		document.body.classList.remove("noscroll");
	});

	// Input price in percent or in numerals
	let priceType: "per" | "num" = $state("per");
	let priceInNumerals = $state({ customer: 0, staff: 0 });

	//Validation
	let validationMessage = $state("Töltsd ki a mezőket termék létrehozásához!");
	let validationBool: boolean = $state(false);

	let validateNewProduct = (): boolean => {
		if (!product.name) {
			validationMessage = "Töltsd ki a név mezőt!";
			validationBool = false;
			return false;
		} else if (!product.category) {
			validationMessage = "Töltsd ki a kategória mezőt!";
			validationBool = false;
			return false;
		} else if (!product.markup && product.markup !== 0) {
			validationMessage = "Töltsd ki a profit mezőt!";
			validationBool = false;
			return false;
		} else if (!product.staffMarkup && product.staffMarkup !== 0) {
			validationMessage = "Töltsd ki a szervezői profit mezőt!";
			validationBool = false;
			return false;
		} else if (!product.allSupplies) {
			validationMessage = "Töltsd ki az összes beszerzett termék mezőt!";
			validationBool = false;
			return false;
		} else if (!product.supplyPrice) {
			validationMessage = "Töltsd ki a beszerzési ár mezőt!";
			validationBool = false;
			return false;
		}

		if (product.name.length > 64) {
			validationMessage = "A név hossza nem lehet több, mint 64 karakter!";
			validationBool = false;
			return false;
		} else if (product.markup > 1000000) {
			validationMessage = "A profit nem lehet több, mint 1.000.000!";
			validationBool = false;
			return false;
		} else if (product.staffMarkup > 1000000) {
			validationMessage = "A szervezői profit nem lehet több, mint 1.000.000!";
			validationBool = false;
			return false;
		} else if (product.allSupplies > 1000000) {
			validationMessage = "Az összes beszerzett termék nem lehet több, mint 1.000.000!";
			validationBool = false;
			return false;
		} else if (product.supplyPrice > 1000000) {
			validationMessage = "A beszerzési ár nem lehet több, mint 1.000.000!";
			validationBool = false;
			return false;
		} else if (product.markup < -1) {
			validationMessage = "A profitnak legalább 1-nek kell lennie!";
			validationBool = false;
			return false;
		} else if (product.staffMarkup < -1) {
			validationMessage = "A szervezői profitnak legalább 1-nek kell lennie!";
			validationBool = false;
			return false;
		} else if (product.allSupplies < 0) {
			validationMessage = "Az összes beszerzett termékeknek legalább 1-nek kell lennie!";
			validationBool = false;
			return false;
		} else if (product.supplyPrice < 0) {
			validationMessage = "A beszerzési árnak legalább 1-nek kell lennie!";
			validationBool = false;
			return false;
		}

		if (priceType === "num") {
			product.markup =
				Math.round(((priceInNumerals.customer - product.supplyPrice) / (product.supplyPrice / 100)) * 100) /
				100;
			product.staffMarkup =
				Math.round(((priceInNumerals.staff - product.supplyPrice) / (product.supplyPrice / 100)) * 100) / 100;
		} else if (priceType === "per") {
			priceInNumerals.customer =
				Math.ceil((product.supplyPrice + (product.supplyPrice / 100) * product.markup) / 5) * 5;
			priceInNumerals.staff =
				Math.ceil((product.supplyPrice + (product.supplyPrice / 100) * product.staffMarkup) / 5) * 5;
		}

		validationMessage = "Töltsd ki a mezőket termék létrehozásához!";
		validationBool = true;
		return true;
	};
	validateNewProduct();

	// Resetting product
	onDestroy(() => {
		if (!(product instanceof ProductC)) {
			product = {
				name: "",
				markup: 0,
				staffMarkup: 0,
				allSupplies: 0,
				supplyPrice: 0,
				category: ""
			};
		}
	});

	$effect(() => {
		if (keyboardEvents.escape) {
			show = false;
		}
	});
</script>

<div class="popup">
	<div class="head">
		<h2>{type == "new" ? "Új termék hozzáadása" : type == "mod" ? "Termék módosítása" : "Ezt hogy csináltad?"}</h2>
		<p>{validationMessage}</p>

		<div class="input-switcher">
			<button
				disabled={priceType == "per"}
				class:accent={priceType == "per"}
				onclick={() => {
					priceType = "per";
				}}>Haszonkulcs</button
			><button
				disabled={priceType == "num"}
				class:accent={priceType == "num"}
				onclick={() => {
					priceType = "num";
				}}>Ár</button
			>
		</div>
	</div>

	<form
		onsubmit={async (e) => {
			e.preventDefault();
			await caller(product);
		}}
		onchange={validateNewProduct}
	>
		<label for="name">
			Név
			<input type="text" name="name" id="name" bind:value={product.name} maxlength="64" minlength="1" required />
		</label>

		<label for="category">
			Kategória
			<input
				type="text"
				name="category"
				id="category"
				bind:value={product.category}
				maxlength="64"
				minlength="1"
				required
				list="categories"
			/>
			<datalist id="categories">
				{#await products?.getCategories()}
					<option value="Kategóriák betöltése folyamatban"></option>
				{:then categories}
					{#each categories as category}
						<option value={category.name}></option>
					{/each}
				{:catch error}
					<option value="Kategóriák betöltése folyamatban!"></option>
				{/await}
			</datalist>
		</label>

		<label for="all-supplies">
			Összes beszerzett termék
			<input
				type="number"
				name="all-supplies"
				id="all-supplies"
				bind:value={product.allSupplies}
				max="1000000"
				min="1"
				required
			/>
		</label>

		<label for="supply-price">
			Beszerzési ár (Ft/db)
			<input
				type="number"
				name="supply-price"
				id="supply-price"
				bind:value={product.supplyPrice}
				max="1000000"
				min="1"
				required
			/>
		</label>

		<div hidden={priceType == "num"} class="set-price">
			<label for="markup" class="top">
				Profit (%)
				<input
					type="number"
					name="markup"
					id="markup"
					bind:value={product.markup}
					max="1000000"
					min="0"
					step="0.01"
					required
				/>
			</label>
			<label for="staff-markup">
				Szervezői Profit (%)
				<input
					type="number"
					name="staff-markup"
					id="staff-markup"
					bind:value={product.staffMarkup}
					max="1000000"
					min="0"
					step="0.01"
					required
				/>
			</label>
		</div>

		<div hidden={priceType == "per"} class="set-price">
			<label for="markup" class="top">
				Ár
				<input
					type="number"
					name="markup"
					id="markup"
					bind:value={priceInNumerals.customer}
					max="1000000"
					min="0"
					required
				/>
			</label>
			<label for="staff-markup">
				Szervezői Ár
				<input
					type="number"
					name="staff-markup"
					id="staff-markup"
					bind:value={priceInNumerals.staff}
					max="1000000"
					min="0"
					required
				/>
			</label>
		</div>

		<div class="finish">
			<button type="submit" disabled={!validationBool}>
				{type == "new" ? "Hozzáadás" : type == "mod" ? "Módosítás" : "Ezt hogy csináltad?"}
			</button>
			<button
				type="reset"
				onclick={() => {
					show = false;
					invalidator();
				}}>Mégsem</button
			>
		</div>
	</form>
</div>

<style>
	.head {
		display: grid;
		grid-template-columns: repeat(2, auto);
		grid-template-rows: repeat(2, auto);
		width: 100%;
		column-gap: 24px;
		grid-template-areas:
			"title input"
			"validation input";

		h2 {
			grid-area: title;
		}

		p {
			grid-area: validation;
		}

		.input-switcher {
			grid-area: input;
			place-self: center end;
			display: grid;
			grid-template-columns: repeat(2, auto);
			gap: 6px;

			.accent {
				color: #000000ff;
				background-color: var(--accent);
				cursor: pointer;
			}
		}
	}

	form {
		margin-top: 24px;
		display: grid;
		gap: 6px;

		label {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			input {
				width: 50%;
			}
		}

		.set-price {
			.top {
				padding-bottom: 6px;
			}
		}

		.finish {
			display: flex;
			gap: 12px;

			button {
				flex: 1;

				&[type="submit"]:not(:disabled) {
					background-color: var(--accent);
					color: #000;
				}
			}
		}
	}

	button:not:disabled {
		background-color: var(--transparent-black);
		&:hover {
			background-color: var(--transparent-white);
		}
	}
</style>
