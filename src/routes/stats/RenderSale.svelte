<script lang="ts">
	import type { SaleC } from "$lib/client/objects.svelte";
	import RenderProductPopup from "./RenderProductPopup.svelte";

	let { sale }: { sale: SaleC } = $props();

	const transposeDate = (
		timestamp: Date,
		options: { useRelativeDays?: boolean; useDays?: boolean; usePostfix?: boolean } = {
			useRelativeDays: false,
			useDays: false,
			usePostfix: false
		}
	): string => {
		const date = new Date(timestamp);

		const year = date.getFullYear();
		const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
		const day = date.getDate() + 1 < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1;

		if (!options.useDays && !options.useRelativeDays) return `${year}. ${month}. ${day}.`;

		const currentDate = new Date();

		const matchYear = date.getFullYear() === currentDate.getFullYear();
		const matchMonth = date.getMonth() === currentDate.getMonth();

		if (options.useRelativeDays && matchYear && matchMonth && date.getDate() === currentDate.getDate() - 1)
			return "Tegnap";

		if (options.useRelativeDays && matchYear && matchMonth && date.getDate() === currentDate.getDate()) return "Ma";

		let dayWithName = options.usePostfix ? "Hétfőn" : "Hétfő";
		switch (date.getDay()) {
			case 0:
				dayWithName = options.usePostfix ? "Vasánap" : "Vasánap";
				break;
			case 1:
				dayWithName = options.usePostfix ? "Hétfőn" : "Hétfő";
				break;
			case 2:
				dayWithName = options.usePostfix ? "Kedden" : "Kedd";
				break;
			case 3:
				dayWithName = options.usePostfix ? "Szerdán" : "Szerda";
				break;
			case 4:
				dayWithName = options.usePostfix ? "Csütörtökön" : "Csütörtök";
				break;
			case 5:
				dayWithName = options.usePostfix ? "Pénteken" : "Péntek";
				break;
			case 6:
				dayWithName = options.usePostfix ? "Szombaton" : "Szombat";
				break;
		}

		if (!options.useDays) return `${year}. ${month}. ${day}.`;
		return `${year}. ${month}. ${day}., ${dayWithName}`;
	};
</script>

<p>
	Új {sale.saleEventProducts.length > 1
		? "termékek lettek"
		: sale.saleEventProducts[0].amount > 1
			? "termékek lettek"
			: "termék lett"}
</p>
<p>{sale.to === "n" ? "résztvevőnek eladva" : sale.to === "s" ? "szervezőnek eladva" : "kivéve a rendszerből"}</p>
<p>{transposeDate(sale.timestamp, { useRelativeDays: true, useDays: true, usePostfix: true }).toLowerCase()}</p>
<button
	onclick={() => {
		sale.productsPopup = !sale.productsPopup;
	}}>Részletek</button
>

{#if sale.productsPopup}
	<RenderProductPopup saleEventProducts={sale.saleEventProducts} {sale}></RenderProductPopup>
{/if}
