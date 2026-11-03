/*---------------------------------------------------------------------------------------------
 *  Copyright (c) CodeStack. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

/// <reference types="svelte" />

declare module '*.svelte' {
	import { SvelteComponentDev } from 'svelte';
	export default class SvelteComponent extends SvelteComponentDev {}
	export default SvelteComponent;
}
