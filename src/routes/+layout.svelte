<script lang="ts">
	import { priceList } from "$lib/client/priceList.svelte";
	import type { LayoutProps } from "./$types";
	import { keyboardEvents } from "$lib/client/keyboardEvents";
	import "$lib/styles/global.css";
	import { afterNavigate } from "$app/navigation";
	import { onMount } from "svelte";
	import { page } from "$app/state";

	let { children }: LayoutProps = $props();

	let activePage: { h: boolean; p: boolean; s: boolean; r: boolean } = $state({
		h: false,
		p: false,
		s: false,
		r: false
	});

	let changeActivePage = (path: string) => {
		activePage = {
			h: false,
			p: false,
			s: false,
			r: false
		};
		switch (path) {
			case "/":
				activePage.h = true;
				break;
			case "/prices":
				activePage.p = true;
				break;
			case "/stats":
				activePage.s = true;
				break;
			case "/storage":
				activePage.r = true;
				break;
		}
	};

	let showHeader: boolean = $state(true);
	let headerTimeout: NodeJS.Timeout;

	onMount(() => {
		changeActivePage(page.url.pathname);
	});

	afterNavigate(({ to }) => {
		if (to?.route.id) changeActivePage(to?.route.id);

		if (to?.route.id === "/prices") {
			headerTimeout = setTimeout(() => {
				showHeader = false;
			}, 3000);
			return;
		}
		showHeader = true;
		clearTimeout(headerTimeout);
	});
</script>

<svelte:window
	onbeforeunload={() => {
		priceList.close();
	}}
	onkeydown={(e) => {
		e.preventDefault();
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
	onmousemove={() => {
		if (page.url.pathname !== "/prices") return;
		showHeader = true;
		clearTimeout(headerTimeout);
		headerTimeout = setTimeout(() => {
			showHeader = false;
		}, 3000);
	}}
/>

<header class={showHeader ? "" : "hide"}>
	<div class="logo">
		<span class="material-symbols-outlined accent"> store </span>
		<h1>Market</h1>
	</div>
	<nav>
		<ul>
			<li><a class={activePage.h == true ? "active" : ""} href="/">Eladás</a></li>
			<li><a class={activePage.p == true ? "active" : ""} href="/prices">Termékek</a></li>
			<li><a class={activePage.s == true ? "active" : ""} href="/stats">Statisztika</a></li>
			<li><a class={activePage.r == true ? "active" : ""} href="/storage">Raktár</a></li>
		</ul>
	</nav>
	<div class="change-price">
		<button
			class={priceList.state == "par" ? "accent" : ""}
			onclick={() => {
				priceList.set("par");
			}}>Résztvevő</button
		>
		<button
			class={priceList.state == "org" ? "accent" : ""}
			onclick={() => {
				priceList.set("org");
			}}>Szervező</button
		>
	</div>
</header>

<main class={showHeader ? "" : "hiddenHeader"}><div class="root">{@render children()}</div></main>

<style>
	header.hide,
	main.hiddenHeader {
		transform: translate(0px, -60px);
		transition: all ease-in-out 1s;
	}
	header {
		transition: all ease-in-out 0.3s;
		background-color: var(--transparent-white);
		backdrop-filter: grayscale(0.5) blur(4px) brightness(0.4);
		height: 60px;
		width: 100vw;
		position: sticky;
		top: 0;
		display: grid;
		grid-template-columns: repeat(3, auto);
		place-items: center;

		& div.logo {
			display: grid;
			width: 100%;
			place-content: center;
			grid-template-columns: repeat(2, auto);
			gap: 6px;

			span {
				font-size: 32px;
			}
			h1 {
				padding-top: 4px;
			}
			h1,
			span {
				display: inline;
			}
		}

		& nav {
			display: inline;

			& ul {
				display: inline;
				list-style-type: none;

				& li {
					margin: 12px;
					display: inline;
				}
			}
		}

		& .change-price {
			& button.accent {
				color: #000000ff;
				background-color: var(--accent);
			}
		}
	}

	main {
		transition: all ease-in-out 0.3s;
		margin-top: 80px;
		width: 100%;

		& .root {
			width: 100%;
			max-width: 800px;
			margin: auto;
		}
	}
</style>
