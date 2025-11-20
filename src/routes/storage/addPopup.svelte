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

	let validateNewProduct = () => {}
</script>

<h2>Új termék hozzáadása</h2>
<p>Töltsd ki a mezőket az új termék hozzáadásához!</p>

<form>
	<label for="name">
		Név: {newProduct.name}
		<input type="text" name="name" id="name" bind:value={newProduct.name} maxlength="64" />
	</label>
	<label for="markup">
		Profit
		<input type="text" name="markup" id="markup" bind:value={newProduct.markup} maxlength="64" />
	</label>
	<label for="staff-markup">
		Szervezői Profit
		<input type="text" name="staff-markup" id="staff-markup" bind:value={newProduct.staffMarkup} maxlength="64" />
	</label>
	<label for="all-supplies">
		Összes beszerzett termék
		<input type="text" name="all-supplies" id="all-supplies" bind:value={newProduct.allSupplies} maxlength="64" />
	</label>
	<label for="supply-price">
		Beszerzési ár
		<input type="text" name="supply-price" id="supply-price" bind:value={newProduct.supplyPrice} maxlength="64" />
	</label>
	<button onclick={add}>Hozzáadás</button>
</form>
