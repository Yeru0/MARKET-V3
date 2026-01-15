<script lang="ts">
	import { keyboardEvents } from "$lib/client/keyboardEvents";
	import { ProductC } from "$lib/client/objects.svelte";
	import { onDestroy, onMount } from "svelte";

	let {
		remove,
		product,
		show = $bindable()
	}: { remove: (product: ProductC) => Promise<{ count: number }>; product: ProductC; show: boolean } = $props();

	onMount(() => {
		document.body.classList.add("noscroll");
	});
	onDestroy(() => {
		document.body.classList.remove("noscroll");
	});

	$effect(() => {
		if (keyboardEvents.escape) {
			show = false;
		}
	});
</script>

<div class="popup">
	<div class="head">
		{#if product.soldAll > 0}
			<h2>Ezt a terméket nem törölheted!</h2>
			<p>Nem lehet törölni {product.name} terméket, mert már vannak hozzá tartozó eladások!</p>
		{:else}
			<h2>Biztos törlöd {product.name} terméket?</h2>
			<p>Ez nem visszafordítható!</p>
		{/if}
	</div>

	<form
		onsubmit={async (e) => {
			e.preventDefault();
			await remove(product);
		}}
		onreset={() => {
			show = false;
		}}
	>
		<div class="finish">
			<button type="submit" disabled={product.soldAll > 0}>Termék törlése</button>
			<button type="reset">Mégsem</button>
		</div>
	</form>
</div>

<style>
	div.popup {
		display: flex;
		flex-direction: column;
		gap: 12px;

		.finish {
			width: 100%;
			display: flex;
			gap: 12px;

			button {
				flex: 1;

				&[type="submit"] {
					background-color: var(--accent);
					color: #000000ff;
				}

				&:disabled {
					background-color: var(--broken-white);
					color: var(--background-black);
				}
			}
		}
	}
</style>
