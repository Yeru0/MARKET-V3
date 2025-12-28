<script lang="ts">
	import type { LayoutProps } from "./$types";

	let { children }: LayoutProps = $props();
</script>

<nav>
	<ul>
		<li><a href="/">Eladás</a></li>
		<li><a href="/prices">Árlista</a></li>
		<li><a href="/stats">Statisztika</a></li>
		<li><a href="/storage">Raktár</a></li>
	</ul>
</nav>

{@render children()}
