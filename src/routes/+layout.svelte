<script lang="ts">
	import { priceList } from "$lib/client/priceList";
	import type { LayoutProps } from "./$types";

	let { children }: LayoutProps = $props();
</script>

<svelte:window
	onbeforeunload={() => {
		priceList.close();
	}}
/>

<nav>
	<ul>
		<li><a href="/">Eladás</a></li>
		<li><a href="/prices">Árlista</a></li>
		<li><a href="/stats">Statisztika</a></li>
		<li><a href="/storage">Raktár</a></li>
	</ul>
	<p>
		Jelenleg eladás: <button
			onclick={() => {
				priceList.switch();
			}}>{priceList.state === "par" ? "Résztvevő" : "Szervező"}</button
		>
	</p>
</nav>

<main>{@render children()}</main>
