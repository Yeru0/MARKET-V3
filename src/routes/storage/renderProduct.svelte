<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

	const { product }: { product: ProductC } = $props();
	

</script>

<h2>{product.name}</h2>
<p>Beszerezve: {product.allSupplies} db</p>
<p>Profit: {product.markup} Ft</p>
<p>Szervezői profit: {product.staffMarkup} Ft</p>
<p>Beszerzési ár (Ft/db) {product.supplyPrice} Ft</p>
<p>Eladott: {product.sales == undefined ? 0 : product.sales.length}</p>
