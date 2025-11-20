<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

	const { product }: { product: ProductC } = $props();

</script>

<h2>{product.name}</h2>
<p>{product.id}</p>
