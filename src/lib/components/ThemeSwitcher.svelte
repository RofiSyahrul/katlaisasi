<script lang="ts">
	import { onMount } from 'svelte';

	import { theme } from '$lib/stores';
	import { setTheme } from '$lib/utils/theme';

	type ThemeOption = {
		label: string;
		value: Theme;
	};

	const themeOptions: ThemeOption[] = [
		{ label: 'System', value: 'system' },
		{ label: 'Light', value: 'light' },
		{ label: 'Dark', value: 'dark' }
	];

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	function handleChangeTheme(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		setTheme(e.currentTarget.value as Theme);
	}
</script>

<select bind:value={$theme} on:change={handleChangeTheme} class:mounted label="Select Theme">
	{#each themeOptions as { label, value } (value)}
		<option {value}>
			{label}
		</option>
	{/each}
</select>

<style>
	select {
		display: none;
		position: fixed;
		z-index: 100;
		top: 8px;
		right: 8px;
	}

	select.mounted {
		display: inline-block;
	}
</style>
