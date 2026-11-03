<!-----------------------------------------------------------------------------------------------
	Copyright (c) CodeStack. All rights reserved.
------------------------------------------------------------------------------------------------>
<script lang="ts">
	import type { CodeStackPortObject } from "../protocol/codestack";

	export let port: CodeStackPortObject;

	$: title = port.status.name || port.status.localPort.toString();

	$: showPortDetail =
		port.status.remotePort != null &&
		port.status.localPort !== port.status.remotePort;

	function getPortDetail(port: CodeStackPortObject) {
		if (showPortDetail) {
			return title === port.status.name
				? ` (${port.status.localPort}:${port.status.remotePort})`
				: ` :${port.status.remotePort}`;
		} else {
			return title === port.status.name ? `(${port.status.localPort})` : "";
		}
	}
	$: portDetail = getPortDetail(port);
</script>

<main>
	<div class="container" title={port.info.tooltip}>
		<span class="title">{title}</span>
		<span class="port-detail">{portDetail}</span>
	</div>
</main>

<style>
	.container {
		display: flex;
	}
	span {
		display: inline-block;
	}
	.title {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.port-detail {
		display: inline-block;
	}
</style>
