<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

	interface obj {
		name: string;
		markup: number;
		staffMarkup: number;
		allSupplies: number;
		supplyPrice: number;
	}

	let { caller, product = $bindable(), type, id = null }: { caller: (id: string | null) => Promise<ProductC | undefined>, product: obj, type: "new" | "mod", id: string | null } = $props();

	let validationMessage = $state("Töltsd ki a mezőket termék létrehozásához!")
	let validationBool: boolean = $state(false)

	let validateNewProduct = (): boolean => {
		if(!product.name) {
			validationMessage = "Töltsd ki a név mezőt!"
			validationBool = false
			return false
		} else if(!product.markup) {
			validationMessage = "Töltsd ki a profit mezőt!"
			validationBool = false
			return false
		} else if(!product.staffMarkup) {
			validationMessage = "Töltsd ki a szervezői profit mezőt!"
			validationBool = false
			return false
		} else if(!product.allSupplies) {
			validationMessage = "Töltsd ki az összes beszerzett termék mezőt!"
			validationBool = false
			return false
		} else if(!product.supplyPrice) {
			validationMessage = "Töltsd ki a beszerzési ár mezőt!"
			validationBool = false
			return false
		}

		if (product.name.length > 64) {
			validationMessage = "A név hossza nem lehet több, mint 64 karakter!"
			validationBool = false
			return false
		} else if (product.markup > 100000) {
			validationMessage = "A profit nem lehet több, mint 1.000.000!"
			validationBool = false
			return false
		} else if (product.staffMarkup > 100000) {
			validationMessage = "A szervezői profit nem lehet több, mint 1.000.000!"
			validationBool = false
			return false
		} else if (product.allSupplies > 100000) {
			validationMessage = "Az összes beszerzett termék nem lehet több, mint 1.000.000!"
			validationBool = false
			return false
		} else if (product.supplyPrice > 100000) {
			validationMessage = "A beszerzési ár nem lehet több, mint 1.000.000!"
			validationBool = false
			return false
		}

		else if (product.markup < 0) {
			validationMessage = "A profitnak legalább 1-nek kell lennie!"
			validationBool = false
			return false
		} else if (product.staffMarkup < 0) {
			validationMessage = "A szervezői profitnak legalább 1-nek kell lennie!"
			validationBool = false
			return false
		} else if (product.allSupplies < 0) {
			validationMessage = "Az összes beszerzett termékeknek legalább 1-nek kell lennie!"
			validationBool = false
			return false
		} else if (product.supplyPrice < 0) {
			validationMessage = "A beszerzési árnak legalább 1-nek kell lennie!"
			validationBool = false
			return false
		}

		validationMessage = "Töltsd ki a mezőket termék létrehozásához!"
		validationBool = true
		return true

	}

	validateNewProduct()

</script>


<h2>{type == "new" ? "Új termék hozzáadása" : type == "mod" ? "Termék módosítása" : "Ezt hogy csináltad?"}</h2>
<p>{validationMessage}</p>


<form onsubmit={() => {caller(id)}} onchange={validateNewProduct}>
	<label for="name">
		Név
		<input type="text" name="name" id="name" bind:value={product.name} maxlength="64" min="1" required/>
	</label>
	<label for="markup">
		Profit
		<input type="number" name="markup" id="markup" bind:value={product.markup} max="1000000" min="1" required/>
	</label>
	<label for="staff-markup">
		Szervezői Profit
		<input type="number" name="staff-markup" id="staff-markup" bind:value={product.staffMarkup} max="1000000" min="1" required/>
	</label>
	<label for="all-supplies">
		Összes beszerzett termék
		<input type="number" name="all-supplies" id="all-supplies" bind:value={product.allSupplies} max="1000000" min="1" required/>
	</label>
	<label for="supply-price">
		Beszerzési ár
		<input type="number" name="supply-price" id="supply-price" bind:value={product.supplyPrice} max="1000000" min="1" required/>
	</label>
	<button type="submit" disabled={!validationBool}>{type == "new" ? "Hozzáadás" : type == "mod" ? "Módosítás" : "Ezt hogy csináltad?"}</button>
</form>
