<script lang="ts">
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

	$: {
		if (typeof document !== 'undefined') {
			setTheme($theme);
		}
	}
</script>

<select bind:value={$theme} label="Select Theme">
	{#each themeOptions as { label, value } (value)}
		<option {value}>
			{label}
		</option>
	{/each}
</select>

<style>
	select {
		position: fixed;
		z-index: 100;
		top: 8px;
		right: 8px;
	}
</style>
