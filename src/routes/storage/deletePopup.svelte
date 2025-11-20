<script lang="ts">
	import { ProductC } from "$lib/client/objects.svelte";

    let {remove, product}: {remove: (id: string) => Promise<{count: number}>, product: ProductC} = $props()
</script>

<h2>Biztos törlöd {product.name} terméket?</h2>
<p>Ez nem visszafordítható!</p>

<form>
    <button onclick={() => {remove(product.id)}}>Termék törlése</button>
</form>