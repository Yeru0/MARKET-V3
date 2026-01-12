<script lang="ts">
	import { priceList } from "$lib/client/priceList.svelte";
	import type { LayoutProps } from "./$types";
	import { keyboardEvents } from "$lib/client/keyboardEvents";
	import { invalid } from "$lib/client/invalidate.svelte";

	let { children }: LayoutProps = $props();
</script>

<svelte:window
	onbeforeunload={() => {
		priceList.close();
	}}
	onkeydown={(e) => {
		if (e.key == "Shift") keyboardEvents.set("s", true);
		if (e.key == "Control") keyboardEvents.set("c", true);
		if (e.key == "Alt") keyboardEvents.set("a", true);
	}}
	onkeyup={(e) => {
		if (e.key == "Shift") keyboardEvents.set("s", false);
		if (e.key == "Control") keyboardEvents.set("c", false);
		if (e.key == "Alt") keyboardEvents.set("a", false);
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
