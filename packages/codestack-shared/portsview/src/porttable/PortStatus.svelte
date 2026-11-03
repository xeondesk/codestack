<!-----------------------------------------------------------------------------------------------
	Copyright (c) CodeStack. All rights reserved.
------------------------------------------------------------------------------------------------>
<script lang="ts">
	import type { IconStatus } from "../protocol/codestack";

	import type { CodeStackPortObject } from "../protocol/codestack";

	export let port: CodeStackPortObject;

	const fillArr: IconStatus[] = ["Detecting", "Served"];

	$: status = port?.info.iconStatus ?? "NotServed";

	$: circleFill = fillArr.includes(status);
</script>

<main>
	<div class="container" title={port.info.description}>
		{#if status === "ExposureFailed"}
			<i class="codicon codicon-warning ExposureFailed" />
		{:else if circleFill}
			<i class={"codicon codicon-circle-filled " + status} />
		{:else}
			<i class={"codicon codicon-circle-outline " + status} />
		{/if}
	</div>
</main>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.Served {
		color: var(--vscode-ports-iconRunningProcessForeground);
	}
	.NotServed {
		color: var(--vscode-foreground);
	}
	.Detecting {
		color: var(--vscode-editorWarning-foreground);
	}
	.ExposureFailed {
		color: var(--vscode-editorWarning-foreground);
	}
</style>
