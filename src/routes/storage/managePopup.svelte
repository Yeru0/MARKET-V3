<script lang="ts">
	import { ProductC, ProductsC } from "$lib/client/objects.svelte";
	import { onDestroy } from "svelte";

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
		product = $bindable(),
		type,
		show = $bindable()
	}: {
		caller: (product: ProductC | obj) => Promise<ProductC | undefined>;
		product: obj | ProductC;
		type: "new" | "mod";
		show: boolean;
	} = $props();

	let products = new ProductsC();

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
		} else if (product.markup > 100000) {
			validationMessage = "A profit nem lehet több, mint 1.000.000!";
			validationBool = false;
			return false;
		} else if (product.staffMarkup > 100000) {
			validationMessage = "A szervezői profit nem lehet több, mint 1.000.000!";
			validationBool = false;
			return false;
		} else if (product.allSupplies > 100000) {
			validationMessage = "Az összes beszerzett termék nem lehet több, mint 1.000.000!";
			validationBool = false;
			return false;
		} else if (product.supplyPrice > 100000) {
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
</script>

<h2>{type == "new" ? "Új termék hozzáadása" : type == "mod" ? "Termék módosítása" : "Ezt hogy csináltad?"}</h2>
<p>{validationMessage}</p>

<p>Ár megadása:</p>
<button
	disabled={priceType == "per"}
	onclick={() => {
		priceType = "per";
	}}>Haszonkulcs</button
><button
	disabled={priceType == "num"}
	onclick={() => {
		priceType = "num";
	}}>Ár</button
>

<form
	onsubmit={(e) => {
		e.preventDefault();
		caller(product);
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
			{#await products.getCategories()}
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
		Ft
	</label>

	<div hidden={priceType == "num"}>
		<label for="markup">
			Profit
			<input type="number" name="markup" id="markup" bind:value={product.markup} max="1000000" min="0" required />
			%
		</label>
		<label for="staff-markup">
			Szervezői Profit
			<input
				type="number"
				name="staff-markup"
				id="staff-markup"
				bind:value={product.staffMarkup}
				max="1000000"
				min="0"
				required
			/>
			%
		</label>
	</div>

	<div hidden={priceType == "per"}>
		<label for="markup">
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
			Ft
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
			Ft
		</label>
	</div>

	<button type="submit" disabled={!validationBool}
		>{type == "new" ? "Hozzáadás" : type == "mod" ? "Módosítás" : "Ezt hogy csináltad?"}</button
	>
	<button
		type="reset"
		onclick={() => {
			show = false;
		}}>Mégsem</button
	>
</form>
