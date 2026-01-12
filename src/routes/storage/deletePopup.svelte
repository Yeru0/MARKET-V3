<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

	let {
		remove,
		product,
		show = $bindable()
	}: { remove: (product: ProductC) => Promise<{ count: number }>; product: ProductC; show: boolean } = $props();
</script>

<h2>Biztos törlöd {product.name} terméket?</h2>
<p>Ez nem visszafordítható!</p>

<form
	onsubmit={async (e) => {
		e.preventDefault();
		await remove(product);
	}}
	onreset={() => {
		show = false;
	}}
>
	<button type="submit">Termék törlése</button>
	<button type="reset">Mégsem</button>
</form>
