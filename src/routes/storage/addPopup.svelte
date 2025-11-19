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
</script>

<form>
	<label for="name">
		Név
		<input type="text" name="name" id="name" value={newProduct.name} maxlength="64" />
	</label>
	<label for="markup">
		Profit
		<input type="text" name="markup" id="markup" value={newProduct.markup} maxlength="64" />
	</label>
	<label for="staff-markup">
		Szervezői Profit
		<input type="text" name="staff-markup" id="staff-markup" value={newProduct.staffMarkup} maxlength="64" />
	</label>
	<label for="all-supplies">
		Összes beszerzett termék
		<input type="text" name="all-supplies" id="all-supplies" value={newProduct.allSupplies} maxlength="64" />
	</label>
	<label for="supply-price">
		Beszerzési ár
		<input type="text" name="supply-price" id="supply-price" value={newProduct.supplyPrice} maxlength="64" />
	</label>
	<button onclick={add}>Hozzáadás</button>
</form>
