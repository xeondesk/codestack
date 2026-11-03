<!-----------------------------------------------------------------------------------------------
	Copyright (c) CodeStack. All rights reserved.
------------------------------------------------------------------------------------------------>
<script lang="ts">
	import { vscode } from "./utils/vscodeApi";
	import PortTable from "./porttable/PortTable.svelte";
	import PortList from "./porttable/PortList.svelte";
	import type { CodeStackPortObject } from "./protocol/codestack";

	let ports: CodeStackPortObject[] = [];

	window.addEventListener("message", (event) => {
		if (event.data.command === "updatePorts") {
			ports = event.data.ports;
		}
	});
	vscode.postMessage({ command: "queryPortData" });

	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<main>
	{#if innerWidth > 500}
		<PortTable {ports} />
	{:else}
		<PortList {ports} />
	{/if}
</main>

<style>
	:global(body) {
		padding: 10px;
	}
</style>
