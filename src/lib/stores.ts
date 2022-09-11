import { writable } from 'svelte/store';

export const theme = writable<Theme>('system');

export const userName = writable('');
