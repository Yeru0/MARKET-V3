<script lang="ts">
	import { priceList } from "$lib/client/priceList.svelte";
	import type { LayoutProps } from "./$types";
	import { keyboardEvents } from "$lib/client/keyboardEvents";
	import "$lib/styles/global.css";

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
		if (e.key == " ") keyboardEvents.set("p", true);

		if (keyboardEvents.shift && keyboardEvents.space) {
			priceList.switch();
		}
	}}
	onkeyup={(e) => {
		if (e.key == "Shift") keyboardEvents.set("s", false);
		if (e.key == "Control") keyboardEvents.set("c", false);
		if (e.key == "Alt") keyboardEvents.set("a", false);
		if (e.key == " ") keyboardEvents.set("p", false);
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

<style>
	nav {
		background-color: var(--transparent-white);
		height: 60px;
		display: grid;

		& ul {
			display: inline;
			list-style-type: none;

			background-color: #00000000;
			& li {
				margin: 12px;
				display: inline;
			}
		}
		& p {
			display: inline;

			background-color: #00000000;
		}
	}
</style>
