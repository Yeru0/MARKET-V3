<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

	interface obj {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
	}

	let { add, newProduct = $bindable() }: { add: () => Promise<ProductC>; newProduct: obj } = $props();

	let validationMessage = $state("Töltsd ki a mezőket termék létrehozásához!")

	let validateNewProduct = () => {
		if(!newProduct.name) {
			validationMessage = "Töltsd ki a név mezőt!"
			return
		} else if(!newProduct.markup) {
			validationMessage = "Töltsd ki a profit mezőt!"
			return
		} else if(!newProduct.staffMarkup) {
			validationMessage = "Töltsd ki a szervezői profit mezőt!"
			return
		} else if(!newProduct.allSupplies) {
			validationMessage = "Töltsd ki az összes beszerzett termék mezőt!"
			return
		} else if(!newProduct.supplyPrice) {
			validationMessage = "Töltsd ki a beszerzési ár mezőt!"
			return
		}

		if (newProduct.name.length > 64) {
			validationMessage = "A név hossza nem lehet több, mint 64 karakter!"
			return
		} else if (newProduct.markup > 100000) {
			validationMessage = "A profit nem lehet több, mint 1.000.000!"
			return
		} else if (newProduct.staffMarkup > 100000) {
			validationMessage = "A szervezői profit nem lehet több, mint 1.000.000!"
			return
		} else if (newProduct.allSupplies > 100000) {
			validationMessage = "Az összes beszerzett termék nem lehet több, mint 1.000.000!"
			return
		} else if (newProduct.supplyPrice > 100000) {
			validationMessage = "A beszerzési ár nem lehet több, mint 1.000.000!"
			return
		}

		else if (newProduct.markup < 0) {
			validationMessage = "A profitnak legalább 1-nek kell lennie!"
			return
		} else if (newProduct.staffMarkup < 0) {
			validationMessage = "A szervezői profitnak legalább 1-nek kell lennie!"
			return
		} else if (newProduct.allSupplies < 0) {
			validationMessage = "Az összes beszerzett termékeknek legalább 1-nek kell lennie!"
			return
		} else if (newProduct.supplyPrice < 0) {
			validationMessage = "A beszerzési árnak legalább 1-nek kell lennie!"
			return
		}

	}

</script>

<h2>Új termék hozzáadása</h2>
<p>{validationMessage}</p>


<form onsubmit={add} onchange={validateNewProduct}>
	<label for="name">
		Név
		<input type="text" name="name" id="name" bind:value={newProduct.name} maxlength="64" min="1" required/>
	</label>
	<label for="markup">
		Profit
		<input type="number" name="markup" id="markup" bind:value={newProduct.markup} max="1000000" min="1" required/>
	</label>
	<label for="staff-markup">
		Szervezői Profit
		<input type="number" name="staff-markup" id="staff-markup" bind:value={newProduct.staffMarkup} max="1000000" min="1" required/>
	</label>
	<label for="all-supplies">
		Összes beszerzett termék
		<input type="number" name="all-supplies" id="all-supplies" bind:value={newProduct.allSupplies} max="1000000" min="1" required/>
	</label>
	<label for="supply-price">
		Beszerzési ár
		<input type="number" name="supply-price" id="supply-price" bind:value={newProduct.supplyPrice} max="1000000" min="1" required/>
	</label>
	<button type="submit">Hozzáadás</button>
</form>
