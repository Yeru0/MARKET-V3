<script lang="ts">
	import { toast } from "$lib/client/toastController.svelte";

	let read: boolean = $state(false);

	$effect(() => {
		if (toast.text === "") {
			read = false;
		}
	});
</script>

<button
	class="toast"
	class:visible={toast.text !== ""}
	class:read
	onmouseenter={() => {
		read = true;
	}}
	onclick={() => {
		toast.text = "";
	}}
>
	<p>{toast.text}</p>
</button>

<style>
	.toast {
		transition: all cubic-bezier(0.54, -0.16, 0.41, 1.2) 0.3s;
		position: fixed;
		bottom: 12px;
		left: 0;
		right: 0;
		margin-inline: auto;
		width: fit-content;
		transform: translate(0, 100px);

		background-color: var(--transparent-black);
		padding: 16px 12px;
		border-radius: 12px;
		backdrop-filter: brightness(0.6) grayscale(0.5) blur(2px);
		z-index: 100000;
		border: 1px solid var(--accent);

		cursor: pointer;

		p {
			font-size: 18px;
			font-weight: 500;
			color: #fff;
		}
	}

	.visible {
		transform: translate(0, 0);
	}
	.read {
		border: none;

		p {
			color: var(--broken-white);
		}
	}
</style>
