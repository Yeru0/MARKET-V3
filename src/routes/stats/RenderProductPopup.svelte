<script lang="ts">
	import { BasketC, ProductC, SaleC } from "$lib/client/objects.svelte";
	import type { saleEventProductsWA } from "$lib/types/db";
	import RenderBasket from "./RenderBasket.svelte";

	let { saleEventProducts, sale, showPopup = $bindable() }: { saleEventProducts: saleEventProductsWA[]; sale: SaleC, showPopup: boolean} = $props();

	let basket = new BasketC();

	for (let s of saleEventProducts) {
		let prod = new ProductC(s.product);
		basket.add(prod, s.amount);
	}
</script>

<div class="popup">
	<RenderBasket {basket} {sale} bind:showPopup = {showPopup}></RenderBasket>
</div>
