<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

	const { product }: { product: ProductC } = $props();
</script>

<h2>{product.name}</h2>

<p>Beszerezve: {product.allSupplies} db</p>
<p>Eladott (összes): {product.sales.length} db</p>
<p>Raktározva: {product.inStorage}</p>

<p>Ár: {product.markupPriceSingle} Ft</p>
<p>Szervezői ár: {product.staffMarkupPriceSingle} Ft</p>

<p>Profit: {product.markup} % / {product.profitSingle} Ft</p>
<p>Szervezői profit: {product.staffMarkup} % / {product.staffProfitSingle} Ft</p>

<p>Beszerzési ár (Ft/db) {product.supplyPrice} Ft</p>
<p>Beszerzési ár (összes) {product.suppliesPrice} Ft</p>

<p>Eladott (általános): {product.sold}</p>
<p>Eladott (szervezői): {product.soldToStaff}</p>
<p>Eladott (kivett): {product.takenOut}</p>
